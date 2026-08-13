from pydantic import BaseModel


# ── POST /embed ────────────────────────────────────────────────────────────────

class EmbedRequest(BaseModel):
    text: str


class EmbedResponse(BaseModel):
    embedding: list[float]


# ── POST /rank ─────────────────────────────────────────────────────────────────

class Candidate(BaseModel):
    user_id: str
    profile_text: str   # concatenated bio + skill names sent by the .NET backend


class RankRequest(BaseModel):
    query_text: str           # GigRequest title + description
    candidates: list[Candidate]


class RankedCandidate(BaseModel):
    user_id: str
    similarity: float         # cosine similarity, 0.0 – 1.0


class RankResponse(BaseModel):
    results: list[RankedCandidate]   # sorted descending by similarity
