import hashlib
import math
import re
from functools import cached_property

from app.core.config import get_settings


class EmbeddingService:
    @cached_property
    def model(self):
        if not get_settings().enable_sentence_transformers:
            return None
        try:
            from sentence_transformers import SentenceTransformer

            return SentenceTransformer(get_settings().embedding_model)
        except Exception:
            return None

    def embed(self, text: str) -> list[float]:
        if self.model is not None:
            vector = self.model.encode([text], normalize_embeddings=True)[0]
            return [float(value) for value in vector]
        return self._hashing_vector(text)

    def similarity(self, left: str, right: str) -> float:
        left_vector = self.embed(left)
        right_vector = self.embed(right)
        return round(max(0.0, min(1.0, self.cosine(left_vector, right_vector))) * 100, 2)

    @staticmethod
    def cosine(left: list[float], right: list[float]) -> float:
        numerator = sum(a * b for a, b in zip(left, right, strict=False))
        left_norm = math.sqrt(sum(a * a for a in left))
        right_norm = math.sqrt(sum(b * b for b in right))
        if not left_norm or not right_norm:
            return 0.0
        return numerator / (left_norm * right_norm)

    @staticmethod
    def _hashing_vector(text: str, size: int = 384) -> list[float]:
        vector = [0.0] * size
        tokens = re.findall(r"[a-zA-Z][a-zA-Z0-9+#.-]{1,}", text.lower())
        for token in tokens:
            digest = hashlib.sha256(token.encode("utf-8")).digest()
            index = int.from_bytes(digest[:4], "big") % size
            sign = 1.0 if digest[4] % 2 == 0 else -1.0
            vector[index] += sign
        norm = math.sqrt(sum(value * value for value in vector)) or 1.0
        return [value / norm for value in vector]
