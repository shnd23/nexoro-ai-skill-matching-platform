from app.ranker import rank_candidates
from app.schemas import Candidate

def test_rank_returns_correct_order():

    candidates = [
        Candidate(user_id="user-1", profile_text="Python machine learning data science NLP"),
        Candidate(user_id="user-2", profile_text="React frontend JavaScript UI design"),
        Candidate(user_id="user-3", profile_text="React Next.js TypeScript frontend developer"),
    ]
    results = rank_candidates(
        query_text="Looking for a frontend React developer to build a web UI",
        candidates=candidates,
    )
    assert len(results) == 3

    top_ids = [r.user_id for r in results[:2]]
    assert "user-1" not in top_ids, (
        f"ML candidate should not be in top-2 for a frontend query. Got: {top_ids}"
    )

def test_rank_empty_candidates():

    results = rank_candidates("some query text", [])
    assert results == []

def test_rank_single_candidate():

    candidates = [Candidate(user_id="u1", profile_text="React developer")]
    results = rank_candidates("Need a React developer", candidates)
    assert len(results) == 1
    assert results[0].user_id == "u1"

def test_rank_scores_in_valid_range():

    candidates = [
        Candidate(user_id="u1", profile_text="React developer"),
        Candidate(user_id="u2", profile_text="Python data scientist"),
    ]
    results = rank_candidates("Need a React developer", candidates)
    for r in results:
        assert 0.0 <= r.similarity <= 1.0, f"Score out of range: {r.similarity}"

def test_rank_sorted_descending():

    candidates = [
        Candidate(user_id="u1", profile_text="Python machine learning"),
        Candidate(user_id="u2", profile_text="React frontend JavaScript"),
        Candidate(user_id="u3", profile_text="React TypeScript Next.js developer"),
    ]
    results = rank_candidates("React developer for frontend project", candidates)
    scores = [r.similarity for r in results]
    assert scores == sorted(scores, reverse=True), f"Results not sorted: {scores}"
