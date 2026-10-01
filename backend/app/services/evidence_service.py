import os
import random
from PIL import Image, ImageDraw, ImageFont
from app.config import settings

class EvidenceService:
    @staticmethod
    def generate_evidence_frame(
        camera_id: str,
        timestamp: str,
        track_id: str,
        confidence: float,
        similarity: float,
        output_filename: str,
        bbox: list = None
    ) -> str:
        """
        Draws a realistic CCTV frame preview with bounding box overlay, camera overlay,
        timestamp text, tracking box, and security watermark.
        """
        width, height = 800, 500
        
        # Create dark CCTV-style canvas background with grid lines
        image = Image.new("RGB", (width, height), color=(15, 20, 28))
        draw = ImageDraw.Draw(image)
        
        # Draw background grid lines for CCTV monitor feel
        for x in range(0, width, 40):
            draw.line([(x, 0), (x, height)], fill=(22, 30, 42), width=1)
        for y in range(0, height, 40):
            draw.line([(0, y), (width, y)], fill=(22, 30, 42), width=1)

        # Draw simulated surveillance scenery elements (hallway / doorway / street lines)
        draw.rectangle([100, 100, 700, 420], outline=(30, 40, 55), width=2)
        draw.line([(0, 420), (100, 420)], fill=(40, 55, 75), width=2)
        draw.line([(700, 420), (800, 420)], fill=(40, 55, 75), width=2)
        
        # Draw target person silhouette bounding box
        if not bbox:
            bbox = [340, 140, 120, 240]
        x, y, w, h = bbox
        
        # Person silhouette box
        draw.rectangle([x, y, x + w, y + h], fill=(28, 38, 54), outline=(59, 130, 246), width=3)
        # Head area circle silhouette
        draw.ellipse([x + w//4, y + 10, x + 3*w//4, y + 10 + w//2], fill=(45, 60, 85), outline=(96, 165, 250), width=2)
        
        # Bounding box corner ticks (electric blue / cyber style)
        tick_len = 15
        color_cyan = (34, 211, 238)
        # Top-Left
        draw.line([(x, y), (x + tick_len, y)], fill=color_cyan, width=4)
        draw.line([(x, y), (x, y + tick_len)], fill=color_cyan, width=4)
        # Top-Right
        draw.line([(x + w, y), (x + w - tick_len, y)], fill=color_cyan, width=4)
        draw.line([(x + w, y), (x + w, y + tick_len)], fill=color_cyan, width=4)
        # Bottom-Left
        draw.line([(x, y + h), (x + tick_len, y + h)], fill=color_cyan, width=4)
        draw.line([(x, y + h), (x, y + h - tick_len)], fill=color_cyan, width=4)
        # Bottom-Right
        draw.line([(x + w, y + h), (x + w - tick_len, y + h)], fill=color_cyan, width=4)
        draw.line([(x + w, y + h), (x + w, y + h - tick_len)], fill=color_cyan, width=4)

        # Label tag above bounding box
        tag_text = f"CANDIDATE ({track_id}) | SIM: {int(similarity * 100)}%"
        draw.rectangle([x, max(10, y - 25), x + 230, y - 2], fill=(15, 23, 42))
        draw.text((x + 6, max(12, y - 22)), tag_text, fill=(59, 130, 246))

        # CCTV Header & Watermark Overlay
        draw.rectangle([10, 10, 260, 45], fill=(10, 14, 23, 200))
        draw.text((20, 16), f"CAM: {camera_id} | REC ●", fill=(239, 68, 68))
        draw.text((20, 28), f"TIME: {timestamp}", fill=(209, 213, 219))

        draw.rectangle([width - 240, 10, width - 10, 45], fill=(10, 14, 23, 200))
        draw.text((width - 230, 16), "FINDTRACE AI EV-SCAN", fill=(34, 211, 238))
        draw.text((width - 230, 28), "REQUIRES HUMAN REVIEW", fill=(251, 146, 60))

        # Save to evidence storage directory
        out_path = os.path.join(settings.EVIDENCE_DIR, output_filename)
        image.save(out_path, format="JPEG", quality=90)
        return f"/api/evidence/frames/{output_filename}"
