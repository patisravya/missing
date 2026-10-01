from typing import List
from app.ai.base import BaseEmbeddingModel
from app.ai.mock_ai import MockEmbeddingModel

class EmbeddingService:
    def __init__(self, model: BaseEmbeddingModel = None):
        self.model = model or MockEmbeddingModel()

    def get_embedding(self, image_crop) -> List[float]:
        return self.model.extract_embedding(image_crop)
