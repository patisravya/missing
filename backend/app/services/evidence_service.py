import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont
from app.config import settings

class EvidenceService:
    @staticmethod
    def draw_cctv_evidence_overlay(
        frame_bgr: np.ndarray,
        camera_id: str,
        timestamp_str: str,
        track_id: str,
        confidence: float,
        similarity: float,
        bbox: list,
        output_filename: str,
        status_label: str = "POTENTIAL CANDIDATE"
    ) -> str:
        """
        Draws accurate CCTV surveillance HUD overlay, cyan/emerald bounding box,
        confidence, similarity metrics, camera ID, timestamp, and legal disclaimer watermark.
        """
        h, w = frame_bgr.shape[:2]
        canvas = frame_bgr.copy()

        x1, y1, x2, y2 = [int(v) for v in bbox]
        bw = x2 - x1
        bh = y2 - y1

        # 1. Draw cyber-style bounding box
        color_cyan = (238, 211, 34) # BGR
        color_blue = (246, 130, 59) # BGR
        color_green = (129, 185, 16) # BGR
        color_orange = (60, 146, 251) # BGR

        # Semi-transparent overlay inside box
        overlay = canvas.copy()
        cv2.rectangle(overlay, (x1, y1), (x2, y2), (40, 25, 10), -1)
        cv2.addWeighted(overlay, 0.25, canvas, 0.75, 0, canvas)

        # Outer box
        cv2.rectangle(canvas, (x1, y1), (x2, y2), color_cyan, 2)

        # Corner ticks
        tick = min(18, max(8, int(min(bw, bh) * 0.25)))
        # Top-left
        cv2.line(canvas, (x1, y1), (x1 + tick, y1), color_cyan, 3)
        cv2.line(canvas, (x1, y1), (x1, y1 + tick), color_cyan, 3)
        # Top-right
        cv2.line(canvas, (x2, y1), (x2 - tick, y1), color_cyan, 3)
        cv2.line(canvas, (x2, y1), (x2, y1 + tick), color_cyan, 3)
        # Bottom-left
        cv2.line(canvas, (x1, y2), (x1 + tick, y2), color_cyan, 3)
        cv2.line(canvas, (x1, y2), (x1, y2 - tick), color_cyan, 3)
        # Bottom-right
        cv2.line(canvas, (x2, y2), (x2 - tick, y2), color_cyan, 3)
        cv2.line(canvas, (x2, y2), (x2, y2 - tick), color_cyan, 3)

        # 2. Tag Label above bounding box
        tag_text = f"{status_label} ({track_id}) | SIM: {int(similarity * 100)}%"
        tag_y = max(24, y1 - 8)
        tag_w = max(210, min(bw + 40, 260))
        cv2.rectangle(canvas, (x1, tag_y - 20), (x1 + tag_w, tag_y + 4), (15, 20, 28), -1)
        cv2.rectangle(canvas, (x1, tag_y - 20), (x1 + tag_w, tag_y + 4), color_cyan, 1)
        cv2.putText(canvas, tag_text, (x1 + 6, tag_y - 6), cv2.FONT_HERSHEY_SIMPLEX, 0.42, (255, 255, 255), 1, cv2.LINE_AA)

        # 3. Top-Left CCTV Header
        cv2.rectangle(canvas, (10, 10), (280, 56), (10, 14, 23), -1)
        cv2.rectangle(canvas, (10, 10), (280, 56), (40, 50, 65), 1)
        # Red recording dot
        cv2.circle(canvas, (24, 26), 4, (68, 68, 239), -1)
        cv2.putText(canvas, f"CAM: {camera_id}  LIVE RECORDING", (34, 29), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (200, 210, 225), 1, cv2.LINE_AA)
        cv2.putText(canvas, f"TS: {timestamp_str} | CONF: {int(confidence * 100)}%", (20, 48), cv2.FONT_HERSHEY_SIMPLEX, 0.38, (150, 165, 185), 1, cv2.LINE_AA)

        # 4. Top-Right FindTrace AI Badge
        cv2.rectangle(canvas, (w - 260, 10), (w - 10, 56), (10, 14, 23), -1)
        cv2.rectangle(canvas, (w - 260, 10), (w - 10, 56), (40, 50, 65), 1)
        cv2.putText(canvas, "FINDTRACE AI RE-ID SCAN", (w - 248, 28), cv2.FONT_HERSHEY_SIMPLEX, 0.40, (238, 211, 34), 1, cv2.LINE_AA)
        cv2.putText(canvas, "REQUIRES HUMAN REVIEW", (w - 248, 46), cv2.FONT_HERSHEY_SIMPLEX, 0.36, (60, 146, 251), 1, cv2.LINE_AA)

        # 5. Bottom Disclaimer Strip
        cv2.rectangle(canvas, (0, h - 22), (w, h), (10, 14, 23), -1)
        cv2.putText(canvas, "Visual similarity score only. Does not constitute positive identification.", (15, h - 7), cv2.FONT_HERSHEY_SIMPLEX, 0.34, (140, 150, 165), 1, cv2.LINE_AA)

        # Save to disk
        out_path = os.path.join(settings.EVIDENCE_DIR, output_filename)
        cv2.imwrite(out_path, canvas, [int(cv2.IMWRITE_JPEG_QUALITY), 92])
        return f"/api/evidence/frames/{output_filename}"

    @staticmethod
    def generate_synthetic_evidence_frame(
        camera_id: str,
        timestamp: str,
        track_id: str,
        confidence: float,
        similarity: float,
        output_filename: str,
        bbox: list = None
    ) -> str:
        """
        Generates dark CCTV-style canvas background when working with simulated demo feeds.
        """
        width, height = 800, 500
        image = Image.new("RGB", (width, height), color=(15, 20, 28))
        draw = ImageDraw.Draw(image)
        
        # Grid lines
        for x in range(0, width, 40):
            draw.line([(x, 0), (x, height)], fill=(22, 30, 42), width=1)
        for y in range(0, height, 40):
            draw.line([(0, y), (width, y)], fill=(22, 30, 42), width=1)

        draw.rectangle([100, 100, 700, 420], outline=(30, 40, 55), width=2)
        draw.line([(0, 420), (100, 420)], fill=(40, 55, 75), width=2)
        draw.line([(700, 420), (800, 420)], fill=(40, 55, 75), width=2)
        
        if not bbox:
            bbox = [340, 140, 120, 240]
        x, y, w, h = bbox
        
        draw.rectangle([x, y, x + w, y + h], fill=(28, 38, 54), outline=(59, 130, 246), width=3)
        draw.ellipse([x + w//4, y + 10, x + 3*w//4, y + 10 + w//2], fill=(45, 60, 85), outline=(96, 165, 250), width=2)
        
        tick_len = 15
        color_cyan = (34, 211, 238)
        draw.line([(x, y), (x + tick_len, y)], fill=color_cyan, width=4)
        draw.line([(x, y), (x, y + tick_len)], fill=color_cyan, width=4)
        draw.line([(x + w, y), (x + w - tick_len, y)], fill=color_cyan, width=4)
        draw.line([(x + w, y), (x + w, y + tick_len)], fill=color_cyan, width=4)
        draw.line([(x, y + h), (x + tick_len, y + h)], fill=color_cyan, width=4)
        draw.line([(x, y + h), (x, y + h - tick_len)], fill=color_cyan, width=4)
        draw.line([(x + w, y + h), (x + w - tick_len, y + h)], fill=color_cyan, width=4)
        draw.line([(x + w, y + h), (x + w, y + h - tick_len)], fill=color_cyan, width=4)

        tag_text = f"POTENTIAL CANDIDATE ({track_id}) | SIM: {int(similarity * 100)}%"
        draw.rectangle([x, max(10, y - 25), x + 240, y - 2], fill=(15, 23, 42))
        draw.text((x + 6, max(12, y - 22)), tag_text, fill=(59, 130, 246))

        draw.rectangle([10, 10, 260, 45], fill=(10, 14, 23, 200))
        draw.text((20, 16), f"CAM: {camera_id} | REC ●", fill=(239, 68, 68))
        draw.text((20, 28), f"TIME: {timestamp} | CONF: {int(confidence * 100)}%", fill=(209, 213, 219))

        draw.rectangle([width - 240, 10, width - 10, 45], fill=(10, 14, 23, 200))
        draw.text((width - 230, 16), "FINDTRACE AI RE-ID", fill=(34, 211, 238))
        draw.text((width - 230, 28), "REQUIRES HUMAN REVIEW", fill=(251, 146, 60))

        out_path = os.path.join(settings.EVIDENCE_DIR, output_filename)
        image.save(out_path, format="JPEG", quality=90)
        return f"/api/evidence/frames/{output_filename}"
