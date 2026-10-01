import math
from typing import List, Dict, Any

class SimilarityService:
    @staticmethod
    def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        if not vec_a or not vec_b or len(vec_a) != len(vec_b):
            return 0.0
        dot = sum(a * b for a, b in zip(vec_a, vec_b))
        norm_a = math.sqrt(sum(a * a for a in vec_a))
        norm_b = math.sqrt(sum(b * b for b in vec_b))
        if norm_a == 0 or norm_b == 0:
            return 0.0
        similarity = dot / (norm_a * norm_b)
        return float(round(max(0.0, min(1.0, similarity)), 4))

    @staticmethod
    def categorize_similarity(score: float) -> str:
        """Categorize into visual similarity bands. Not proof of identity."""
        if score >= 0.80:
            return "High Similarity"
        elif score >= 0.70:
            return "Medium Similarity"
        else:
            return "Low Similarity"

    @staticmethod
    def filter_candidates(candidates: List[Dict[str, Any]], threshold: float = 0.70) -> List[Dict[str, Any]]:
        """Filter candidates above user-configured similarity threshold."""
        return [c for c in candidates if c.get("similarity_score", 0.0) >= threshold]
