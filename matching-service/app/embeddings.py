import os
from sentence_transformers import SentenceTransformer
import numpy as np

MODEL_NAME = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")

print(f"[embeddings] Loading SBERT model: {MODEL_NAME}")
_model = SentenceTransformer(MODEL_NAME)
print(f"[embeddings] Model ready — embedding dimension: {_model.get_sentence_embedding_dimension()}")

def embed_text(text: str) -> list[float]:

    embedding = _model.encode(text, normalize_embeddings=True)
    return embedding.tolist()

def embed_batch(texts: list[str]) -> np.ndarray:

    return _model.encode(texts, normalize_embeddings=True, batch_size=32)
