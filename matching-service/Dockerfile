# ── Stage: runtime ────────────────────────────────────────────────────────────
FROM python:3.11-slim

WORKDIR /app

# Install dependencies first — this layer is cached and only rebuilds
# when requirements.txt changes, not when source code changes.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY app/ ./app/

# Pre-download the SBERT model and bake it into the image.
# Without this, the model downloads on first startup (slow, needs internet
# at runtime, and breaks cold starts in air-gapped environments).
RUN python -c "\
from sentence_transformers import SentenceTransformer; \
m = SentenceTransformer('all-MiniLM-L6-v2'); \
print(f'Model cached — dim: {m.get_sentence_embedding_dimension()}')"

EXPOSE 8000

# --host 0.0.0.0: inside Docker, 'localhost' refers only to the container.
# 0.0.0.0 means "accept connections from any interface" — required so the
# .NET backend (in another container) can reach this service.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
