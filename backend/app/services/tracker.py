from app.ai.base import BaseTracker
from app.ai.mock_ai import MockTracker

class TrackerService:
    def __init__(self, tracker: BaseTracker = None):
        self.tracker = tracker or MockTracker()

    def update(self, detections, frame_id: int):
        return self.tracker.update_tracks(detections, frame_id)
