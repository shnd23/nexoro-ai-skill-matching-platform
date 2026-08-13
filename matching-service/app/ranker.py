import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.embeddings import embed_text, embed_batch
from app.schemas import Candidate, RankedCandidate


def rank_candidates(query_text: str, candidates: list[Candidate]) -> list[RankedCandidate]:
    """
    Given a GigRequest description and a list of candidate user profiles,
    return candidates sorted by semantic similarity to the query, descending.

    How it works:
    1. Embed the query into a 384-d vector.
    2. Embed all candidate profiles in one batch (much faster than one-by-one).
    3. Compute cosine similarity between the query vector and every candidate vector.
    4. Sort by score descending and return.

    The scoring is purely semantic — it doesn't need exact keyword matches.
    "React engineer" and "frontend developer who loves JSX" will score similarly
    because the model understands the meaning of both phrases.
    """
    if not candidates:
        return []

    # 1. Embed the query (single pass)
    query_embedding = embed_text(query_text)

    # 2. Embed all candidate profiles in one batch
    profile_texts = [c.profile_text for c in candidates]
    candidate_embeddings = embed_batch(profile_texts)

    # 3. cosine_similarity expects 2D arrays.
    #    The result is shape (1, n_candidates) — we take [0] to get the 1D array.
    scores = cosine_similarity([query_embedding], candidate_embeddings)[0]

    # 4. Pair each candidate with their score and sort descending
    ranked = [
        RankedCandidate(user_id=candidate.user_id, similarity=float(score))
        for candidate, score in zip(candidates, scores)
    ]
    ranked.sort(key=lambda x: x.similarity, reverse=True)

    return ranked
