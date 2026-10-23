import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

from app.embeddings import embed_text, embed_batch
from app.schemas import Candidate, RankedCandidate

def rank_candidates(query_text: str, candidates: list[Candidate]) -> list[RankedCandidate]:

    if not candidates:
        return []

    query_embedding = embed_text(query_text)

    profile_texts = [c.profile_text for c in candidates]
    candidate_embeddings = embed_batch(profile_texts)

    scores = cosine_similarity([query_embedding], candidate_embeddings)[0]

    ranked = [
        RankedCandidate(user_id=candidate.user_id, similarity=float(score))
        for candidate, score in zip(candidates, scores)
    ]
    ranked.sort(key=lambda x: x.similarity, reverse=True)

    return ranked
