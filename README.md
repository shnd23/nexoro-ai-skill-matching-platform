# Nexero

**A full-stack AI-powered gig marketplace.** Users post what they need, the platform matches them with people whose skills fit — using a hybrid ranking engine that blends tag overlap with semantic similarity from a fine-tuned SBERT model.

Built with production-grade architecture across three separate services: a .NET REST API following Clean Architecture, a Python FastAPI ML inference microservice, and a Next.js frontend. Orchestrated with Docker Compose.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Browser (Next.js)                        │
│                    TypeScript · Tailwind CSS                    │
│       Auth Context · Typed API Client · Server Components       │
└─────────────────────────┬───────────────────────────────────────┘
                          │  HTTP (proxied via Next.js rewrite)
                          ▼
┌─────────────────────────────────────────────────────────────────┐
│                        .NET 10 REST API                         │
│                  Clean Architecture (3 layers)                  │
│                                                                 │
│  Domain             Infrastructure            Api               │
│  ─────────          ──────────────────        ─────             │
│  Entities           EF Core (Postgres)        Controllers       │
│  Interfaces         ASP.NET Identity          JWT Auth          │
│  Records            Repositories              Google OAuth      │
│                     HybridMatchingService     Swagger           │
└──────┬─────────────────────────────────────────┬────────────────┘
       │  POST /rank (HTTP JSON)                 │  SQL
       ▼                                         ▼
┌───────────────────────┐               ┌───────────────────────┐
│    Python FastAPI     │               │     PostgreSQL 16     │
│   Matching Service    │               │                       │
│                       │               │  Users                │
│   SBERT Embeddings    │               │  GigRequests          │
│   Cosine Similarity   │               │  Skills               │
│   384-dim vectors     │               │  Matches              │
└───────────────────────┘               └───────────────────────┘
```

### How matching works

When a GigRequest is posted:
1. **Tag-overlap retrieval** — SQL query finds all users with at least one matching skill tag (`O(n)` query, runs in milliseconds)
2. **Semantic re-ranking** — the shortlist is sent to the Python service, which embeds the GigRequest description and every candidate's profile using `all-MiniLM-L6-v2`, then computes cosine similarity
3. **Score blending** — final score = `0.4 × tag_overlap + 0.6 × semantic_similarity`
4. **Graceful degradation** — if the ML service is unreachable (timeout: 10s), the system automatically falls back to tag-overlap-only ranking. The platform keeps working; it just degrades gracefully

This means a user who describes themselves as a "frontend engineer who loves component architecture" will match a GigRequest asking for a "React developer" — even if they've never written the word "React" in their tags.

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 14, TypeScript, Tailwind CSS | App Router, SSR, typed API client |
| Backend | .NET 10, ASP.NET Core, EF Core | Clean Architecture, strong typing, Identity |
| ML Service | Python 3.12, FastAPI, sentence-transformers | Python ML ecosystem, stateless inference |
| Embeddings | `all-MiniLM-L6-v2` (SBERT) | 384-dim, fast CPU inference, strong semantic quality |
| Similarity | scikit-learn cosine_similarity | Normalized vectors → dot product == cosine |
| Database | PostgreSQL 16 | Relational integrity for users/skills/matches |
| Auth | JWT + Google OAuth (GIS) | Stateless API auth, social login |
| Containerization | Docker, Docker Compose | Reproducible environments, service isolation |

---

## Why three separate services?

The ML inference service is its own process for concrete reasons:

- **Different runtime requirements** — `sentence-transformers` needs Python's ML ecosystem. There's no good .NET equivalent that's as fast or as well-maintained
- **Different scaling characteristics** — the API is I/O-bound; ML inference is CPU-bound. Separate processes can be scaled independently
- **Swappable** — replacing `all-MiniLM-L6-v2` with a larger model, or swapping SBERT for an OpenAI embedding API, requires zero changes to the .NET backend. The contract is a JSON POST
- **Testable in isolation** — the ML service has its own pytest suite that verifies semantic quality independently of the rest of the system

The .NET backend treats the ML service as a pure function: send text in, get scores back.

---

## Project Structure

```
nexero/
├── docker-compose.yml          ← orchestrates postgres + ML service
├── .gitignore
│
├── Nexero_backend/             ← .NET Clean Architecture API
│   ├── src/
│   │   ├── GigMarketplace.Domain/
│   │   │   ├── Entities/       ← User, GigRequest, Match, Skill
│   │   │   └── Interfaces/     ← IMatchingService, IRepositories
│   │   ├── GigMarketplace.Infrastructure/
│   │   │   ├── Data/           ← EF Core DbContext, migrations
│   │   │   ├── Repositories/   ← concrete repo implementations
│   │   │   └── Services/
│   │   │       ├── HybridMatchingService.cs   ← ML + tag blend
│   │   │       └── TagOverlapMatchingService.cs
│   │   └── GigMarketplace.Api/
│   │       ├── Controllers/    ← Auth, Users, GigRequests, Skills
│   │       └── Program.cs
│   └── tests/
│
├── Nexero_frontend/            ← Next.js 14 App Router
│   ├── app/                    ← pages (login, register, feed, profile, gigs)
│   ├── components/             ← Navbar, GoogleSignInButton, UI kit
│   └── lib/
│       ├── api.ts              ← typed API client
│       └── auth-context.tsx    ← React auth state + JWT management
│
└── matching-service/           ← Python FastAPI ML microservice
    ├── app/
    │   ├── main.py             ← /health /embed /rank
    │   ├── embeddings.py       ← SBERT model, embed_text(), embed_batch()
    │   ├── ranker.py           ← cosine similarity ranking
    │   └── schemas.py          ← Pydantic contracts
    ├── tests/                  ← pytest: shape, semantic quality, edge cases
    └── Dockerfile
```

---

## Running Locally

**Prerequisites:** Docker Desktop, .NET 10 SDK, Node.js 18+, Python 3.12

### 1. Start infrastructure

```bash
# From the repo root — starts Postgres + ML service
docker compose up --build
```

Wait for: `Application startup complete.` from the matching service.

### 2. Run the backend

```bash
cd Nexero_backend
dotnet run --project src/GigMarketplace.Api
# → listening on http://localhost:5097
```

### 3. Run the frontend

```bash
cd Nexero_frontend
npm install
npm run dev
# → http://localhost:3000
```

### 4. Open the app

Navigate to **http://localhost:3000**

---

## API Reference

Full interactive docs available at `http://localhost:5097/swagger` when the backend is running.

### Auth
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register` | Email + password registration |
| `POST` | `/api/auth/login` | Returns JWT |
| `POST` | `/api/auth/google` | Google ID token → JWT |

### Users
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/users/me` | Authenticated user profile |
| `PUT` | `/api/users/me` | Update profile, bio, avatar |
| `POST` | `/api/users/me/skills` | Add a skill to your profile |

### Gigs & Matching
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/skills` | List all available skills |
| `POST` | `/api/gigrequests` | Post a gig (triggers ML matching) |
| `GET` | `/api/gigrequests` | Browse all open gigs |
| `GET` | `/api/gigrequests/{id}/matches` | Ranked candidate matches for a gig |

### ML Service
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/health` | Liveness check |
| `POST` | `/embed` | Text → 384-dim embedding vector |
| `POST` | `/rank` | Query + candidates → similarity scores |

---

## ML Service Tests

```bash
cd matching-service
.venv/Scripts/Activate.ps1   # Windows
pip install -r requirements.txt
pytest tests/ -v
```

Expected output:
```
tests/test_embeddings.py::test_embed_returns_correct_dimension              PASSED
tests/test_embeddings.py::test_similar_texts_score_higher_than_dissimilar   PASSED
tests/test_embeddings.py::test_embed_deterministic                          PASSED
tests/test_ranker.py::test_rank_returns_correct_order                       PASSED
tests/test_ranker.py::test_rank_scores_in_valid_range                       PASSED
tests/test_ranker.py::test_rank_sorted_descending                           PASSED
10 passed in 13.85s
```

---

## Key Engineering Decisions

**Clean Architecture in the backend** — Domain has zero dependencies on infrastructure. Swapping EF Core for Dapper, or PostgreSQL for SQL Server, requires touching only the Infrastructure layer. The Domain layer defines interfaces; Infrastructure implements them. This is the pattern used at scale in enterprise .NET.

**Model loaded once at startup, not per request** — Loading `all-MiniLM-L6-v2` takes ~3 seconds and uses ~90MB of RAM. Per-request loading would make the service unusably slow. The model is a module-level singleton, initialized when the Python process starts, and reused across all requests.

**Stateless ML service** — The matching service holds no database connection, no session state, no user data. It receives text, returns numbers. This makes it trivially horizontally scalable — run 10 instances behind a load balancer with no coordination needed.

**Hybrid scoring** — Pure semantic similarity underweights explicit skill tags that users deliberately set. Pure tag overlap misses candidates with relevant experience but slightly different vocabulary. The 40/60 blend captures both signals, with semantic weighted higher because it generalizes better.

**JWT + stateless auth** — No server-side sessions. The token carries the user ID and is verified on every request using HMAC-SHA256. This scales horizontally — any backend instance can serve any request without shared session state.

**Google OAuth via GIS** — The frontend uses Google Identity Services to get an ID token from Google's servers. The token is then validated by the .NET backend using `Google.Apis.Auth` (verifies the signature against Google's public keys). No OAuth redirect flows, no session state, same JWT response shape as email/password login.

---

## Environment Variables

**Backend** (`Nexero_backend/src/GigMarketplace.Api/appsettings.Development.json`):
```json
{
  "Jwt": { "Key": "...", "Issuer": "GigMarketplace", "Audience": "GigMarketplace" },
  "Google": { "ClientId": "your-google-client-id.apps.googleusercontent.com" },
  "MatchingService": { "BaseUrl": "http://localhost:8000" },
  "ConnectionStrings": { "DefaultConnection": "Host=localhost;Port=5432;Database=gigmarketplace;Username=postgres;Password=postgres" }
}
```

**Matching Service** (`matching-service/.env`):
```
MODEL_NAME=all-MiniLM-L6-v2
PORT=8000
```

**Frontend** (`Nexero_frontend/.env.local`):
```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

---

## License

MIT
