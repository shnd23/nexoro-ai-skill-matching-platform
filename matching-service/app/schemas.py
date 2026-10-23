from pydantic import BaseModel

class EmbedRequest(BaseModel):
    text: str

class EmbedResponse(BaseModel):
    embedding: list[float]

class Candidate(BaseModel):
    user_id: str
    profile_text: str

class RankRequest(BaseModel):
    query_text: str
    candidates: list[Candidate]

class RankedCandidate(BaseModel):
    user_id: str
    similarity: float

class RankResponse(BaseModel):
    results: list[RankedCandidate]
