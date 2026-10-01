from app.ai.base import BasePersonDetector
from app.ai.mock_ai import MockPersonDetector

class PersonDetectorService:
    def __init__(self, detector: BasePersonDetector = None):
        self.detector = detector or MockPersonDetector()

    def detect(self, frame, confidence_threshold: float = 0.50):
        return self.detector.detect_persons(frame, confidence_threshold)
