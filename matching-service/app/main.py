from fastapi import FastAPI
from dotenv import load_dotenv

from app.schemas import EmbedRequest, EmbedResponse, RankRequest, RankResponse
from app.embeddings import embed_text
from app.ranker import rank_candidates

load_dotenv()

app = FastAPI(
    title="Nexero Matching Service",
    description=(
        "Stateless ML microservice. Embeds text using SBERT and ranks candidate "
        "user profiles by semantic similarity to a GigRequest description."
    ),
    version="1.0.0",
)

@app.get("/health")
def health():

    return {"status": "ok"}

@app.post("/embed", response_model=EmbedResponse)
def embed(request: EmbedRequest):

    embedding = embed_text(request.text)
    return EmbedResponse(embedding=embedding)

@app.post("/rank", response_model=RankResponse)
def rank(request: RankRequest):

    results = rank_candidates(request.query_text, request.candidates)
    return RankResponse(results=results)
