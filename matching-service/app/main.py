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
    """
    Simple liveness check.
    The .NET backend calls this on startup to confirm the matching service
    is reachable before it starts accepting traffic.
    """
    return {"status": "ok"}


@app.post("/embed", response_model=EmbedResponse)
def embed(request: EmbedRequest):
    """
    Embed a single piece of text into a 384-dimensional vector.

    Called by the .NET backend when a GigRequest is created so the embedding
    can be stored in Postgres (pgvector column) for future nearest-neighbour
    searches — which will eventually bypass this service entirely at scale.
    """
    embedding = embed_text(request.text)
    return EmbedResponse(embedding=embedding)


@app.post("/rank", response_model=RankResponse)
def rank(request: RankRequest):
    """
    Rank a list of candidate user profiles against a GigRequest description.

    The .NET backend sends the shortlist it already filtered by tag overlap.
    This endpoint re-ranks them semantically — candidates whose profile *means*
    the same thing as the query score higher, even without exact keyword matches.

    Returns candidates sorted by similarity score, descending.
    """
    results = rank_candidates(request.query_text, request.candidates)
    return RankResponse(results=results)
