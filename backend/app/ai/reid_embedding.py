import cv2
import numpy as np
import torch
import torch.nn as nn
import torchvision.transforms as T
import torchvision.models as models
from typing import List, Optional, Union
from app.ai.base import BaseEmbeddingModel

class ReIDEmbeddingModel(BaseEmbeddingModel):
    """
    Person Re-Identification Deep & Spatial Part Feature Extractor.
    Combines:
    1. Deep PyTorch CNN multi-scale spatial feature maps (MobileNetV3 backbone)
    2. Multi-Zone Spatial Appearance Signatures (Head / Upper Torso / Lower Body)
    3. Zero-mean centered and L2-normalized 512-D Re-ID feature embeddings.
    """
    def __init__(self, device: Optional[str] = None):
        if device is None:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = torch.device(device)

        try:
            backbone = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
        except Exception:
            backbone = models.mobilenet_v3_small(weights=None)

        self.features = backbone.features
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        
        self.to(self.device)
        self.eval()

        # Standard Re-ID preprocessing
        self.transform = T.Compose([
            T.ToPILImage(),
            T.Resize((256, 128), interpolation=T.InterpolationMode.BILINEAR),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def to(self, device):
        self.device = device
        self.features.to(device)
        self.avgpool.to(device)
        return self

    def eval(self):
        self.features.eval()
        return self

    def _extract_part_descriptors(self, crop_bgr: np.ndarray) -> np.ndarray:
        """Extracts vertical spatial part appearance histograms (Head, Torso, Legs)."""
        if crop_bgr is None or crop_bgr.size == 0:
            return np.zeros(192, dtype=np.float32)

        h, w = crop_bgr.shape[:2]
        h1 = max(1, int(h * 0.25))
        h2 = max(h1 + 1, int(h * 0.65))

        parts = [
            crop_bgr[0:h1, :],
            crop_bgr[h1:h2, :],
            crop_bgr[h2:h, :]
        ]

        feats = []
        for p in parts:
            if p.size == 0:
                feats.append(np.zeros(32, dtype=np.float32))
                continue
            hsv = cv2.cvtColor(p, cv2.COLOR_BGR2HSV)
            h_hist = cv2.calcHist([hsv], [0], None, [16], [0, 180]).flatten()
            s_hist = cv2.calcHist([hsv], [1], None, [8], [0, 256]).flatten()
            v_hist = cv2.calcHist([hsv], [2], None, [8], [0, 256]).flatten()

            part_f = np.concatenate([h_hist, s_hist, v_hist]).astype(np.float32)
            part_f = part_f - np.mean(part_f)
            n = np.linalg.norm(part_f)
            if n > 1e-12:
                part_f = part_f / n
            feats.append(part_f)

        full = np.concatenate(feats).astype(np.float32)
        n = np.linalg.norm(full)
        if n > 1e-12:
            full = full / n
        return full

    def extract_embedding(self, image_crop: np.ndarray) -> np.ndarray:
        """Extracts L2-normalized 1D fused Re-ID embedding vector."""
        if image_crop is None or image_crop.size == 0:
            return np.zeros(288, dtype=np.float32)

        rgb_crop = cv2.cvtColor(image_crop, cv2.COLOR_BGR2RGB) if len(image_crop.shape) == 3 and image_crop.shape[2] == 3 else image_crop
        tensor_img = self.transform(rgb_crop).unsqueeze(0).to(self.device)

        with torch.no_grad():
            f = self.features(tensor_img)
            f_pool = self.avgpool(f)
            cnn_feat = torch.flatten(f_pool, 1)
            cnn_feat = cnn_feat - torch.mean(cnn_feat, dim=1, keepdim=True)
            cnn_norm = torch.norm(cnn_feat, p=2, dim=1, keepdim=True).clamp(min=1e-12)
            cnn_vec = (cnn_feat / cnn_norm).squeeze(0).cpu().numpy().astype(np.float32)
            # Reduce dimension
            cnn_vec_sampled = cnn_vec[:192]
            n_cnn = np.linalg.norm(cnn_vec_sampled)
            if n_cnn > 1e-12:
                cnn_vec_sampled /= n_cnn

        # Spatial part appearance features (96-D)
        part_vec = self._extract_part_descriptors(image_crop)

        # Fuse: 40% deep CNN geometry + 60% spatial part distribution
        fused = np.concatenate([cnn_vec_sampled * 0.40, part_vec * 0.60])
        norm = np.linalg.norm(fused)
        if norm > 1e-12:
            fused = fused / norm

        return fused.astype(np.float32)

    def extract_batch_embeddings(self, crops: List[np.ndarray]) -> np.ndarray:
        """Extracts L2-normalized 2D embeddings array (N, D) for a batch of crops."""
        if not crops:
            return np.empty((0, 288), dtype=np.float32)

        embeddings = [self.extract_embedding(c) for c in crops]
        return np.array(embeddings, dtype=np.float32)

    @staticmethod
    def compute_cosine_similarity(vec1: np.ndarray, vec2: np.ndarray) -> float:
        """
        Computes cosine similarity between two normalized vectors.
        """
        if vec1 is None or vec2 is None or len(vec1) == 0 or len(vec2) == 0:
            return 0.0

        n1 = np.linalg.norm(vec1)
        n2 = np.linalg.norm(vec2)
        if n1 < 1e-12 or n2 < 1e-12:
            return 0.0

        dot = float(np.dot(vec1, vec2) / (n1 * n2))
        sim = max(0.0, min(1.0, dot))
        return float(round(sim, 4))

    @staticmethod
    def compute_multi_reference_similarity(candidate_vec: np.ndarray, ref_vectors: List[np.ndarray]) -> float:
        """Computes maximum similarity against multiple reference photos / angles."""
        if not ref_vectors or candidate_vec is None:
            return 0.0

        similarities = [ReIDEmbeddingModel.compute_cosine_similarity(candidate_vec, ref) for ref in ref_vectors]
        if not similarities:
            return 0.0
        return float(max(similarities))
