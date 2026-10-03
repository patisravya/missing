import cv2
import numpy as np
import torch
import torchvision.transforms as T
from typing import List, Dict, Any, Optional
from app.ai.base import BasePersonDetector

class TorchPersonDetector(BasePersonDetector):
    """
    Real COCO Person Detector using PyTorch SSDLite320 with MobileNetV3-Large backbone.
    Specifically tuned for class 'person' (COCO class ID 1) with configurable detection threshold.
    """
    def __init__(self, device: Optional[str] = None):
        if device is None:
            self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        else:
            self.device = torch.device(device)

        import torchvision.models.detection as detection
        try:
            weights = detection.SSDLite320_MobileNet_V3_Large_Weights.DEFAULT
            self.model = detection.ssdlite320_mobilenet_v3_large(weights=weights)
        except Exception as e:
            # Offline initialization if weights file already cached or default
            self.model = detection.ssdlite320_mobilenet_v3_large(weights=None)
        
        self.model.to(self.device)
        self.model.eval()

        self.transform = T.Compose([
            T.ToTensor()
        ])

    def detect_persons(self, frame_bgr: np.ndarray, confidence_threshold: float = 0.40) -> List[Dict[str, Any]]:
        if frame_bgr is None or frame_bgr.size == 0:
            return []

        h, w = frame_bgr.shape[:2]
        frame_rgb = cv2.cvtColor(frame_bgr, cv2.COLOR_BGR2RGB)
        tensor_img = self.transform(frame_rgb).to(self.device)

        detections = []
        with torch.no_grad():
            outputs = self.model([tensor_img])[0]

        boxes = outputs["boxes"].cpu().numpy()
        scores = outputs["scores"].cpu().numpy()
        labels = outputs["labels"].cpu().numpy()

        for box, score, label in zip(boxes, scores, labels):
            # Class 1 in COCO dataset is 'person'
            if label == 1 and score >= confidence_threshold:
                x1, y1, x2, y2 = [int(max(0, v)) for v in box]
                x1, y1 = min(x1, w - 1), min(y1, h - 1)
                x2, y2 = min(max(x1 + 1, x2), w), min(max(y1 + 1, y2), h)
                
                bw = x2 - x1
                bh = y2 - y1
                area = bw * bh

                detections.append({
                    "class": "person",
                    "confidence": float(round(score, 4)),
                    "bbox": [x1, y1, x2, y2],
                    "area": float(area)
                })

        return detections

class OpenCVPersonDetector(BasePersonDetector):
    """
    Fallback Person Detector using OpenCV HOG + Linear SVM when PyTorch is not loaded.
    """
    def __init__(self):
        self.hog = cv2.HOGDescriptor()
        self.hog.setSVMDetector(cv2.HOGDescriptor_getDefaultPeopleDetector())

    def detect_persons(self, frame_bgr: np.ndarray, confidence_threshold: float = 0.40) -> List[Dict[str, Any]]:
        if frame_bgr is None or frame_bgr.size == 0:
            return []

        h, w = frame_bgr.shape[:2]
        rects, weights = self.hog.detectMultiScale(
            frame_bgr,
            winStride=(8, 8),
            padding=(4, 4),
            scale=1.05
        )

        detections = []
        for rect, weight in zip(rects, weights):
            conf = float(weight[0]) if hasattr(weight, '__iter__') else float(weight)
            # Normalize HOG confidence roughly to 0.0 - 1.0 range
            norm_conf = max(0.0, min(1.0, 1.0 / (1.0 + np.exp(-conf))))
            if norm_conf >= confidence_threshold:
                rx, ry, rw, rh = rect
                x1 = max(0, int(rx))
                y1 = max(0, int(ry))
                x2 = min(w, int(rx + rw))
                y2 = min(h, int(ry + rh))

                detections.append({
                    "class": "person",
                    "confidence": float(round(norm_conf, 4)),
                    "bbox": [x1, y1, x2, y2],
                    "area": float((x2 - x1) * (y2 - y1))
                })

        return detections
