import os
from sentence_transformers import SentenceTransformer
import numpy as np

MODEL_NAME = os.getenv("MODEL_NAME", "all-MiniLM-L6-v2")

# ─────────────────────────────────────────────────────────────────────────────
# The model is loaded ONCE when this module is first imported — not per request.
# Loading takes a few seconds; doing it per-request would make the service
# unusably slow and waste memory on repeated copies.
# ─────────────────────────────────────────────────────────────────────────────
print(f"[embeddings] Loading SBERT model: {MODEL_NAME}")
_model = SentenceTransformer(MODEL_NAME)
print(f"[embeddings] Model ready — embedding dimension: {_model.get_sentence_embedding_dimension()}")


def embed_text(text: str) -> list[float]:
    """
    Convert a string into a fixed-length embedding vector.

    The vector captures the *semantic meaning* of the text — similar sentences
    produce similar vectors even if they share no keywords.

    normalize_embeddings=True: keeps vectors on the unit hypersphere so that
    cosine similarity == dot product, which is faster to compute and guarantees
    scores stay in [-1, 1] (in practice 0–1 for natural language).
    """
    embedding = _model.encode(text, normalize_embeddings=True)
    return embedding.tolist()


def embed_batch(texts: list[str]) -> np.ndarray:
    """
    Embed multiple texts in one pass.

    Batching is significantly faster than calling embed_text in a loop because
    the transformer processes them in parallel on its internal matrix ops.
    batch_size=32 is a safe default for CPU inference; increase if GPU is
    available.
    """
    return _model.encode(texts, normalize_embeddings=True, batch_size=32)
