from app.embeddings import embed_text, embed_batch

def test_embed_returns_list_of_floats():
    result = embed_text("I need a React developer")
    assert isinstance(result, list)
    assert all(isinstance(x, float) for x in result)

def test_embed_returns_correct_dimension():

    result = embed_text("hello world")
    assert len(result) == 384

def test_embed_batch_shape():
    texts = ["React developer", "Python engineer", "UI designer"]
    result = embed_batch(texts)
    assert result.shape == (3, 384)

def test_similar_texts_score_higher_than_dissimilar():

    from sklearn.metrics.pairwise import cosine_similarity

    e_react_1 = embed_text("React developer with frontend experience")
    e_react_2 = embed_text("Frontend engineer specializing in React.js")
    e_ml     = embed_text("Machine learning researcher working on NLP models")

    sim_related  = cosine_similarity([e_react_1], [e_react_2])[0][0]
    sim_unrelated = cosine_similarity([e_react_1], [e_ml])[0][0]

    assert sim_related > sim_unrelated, (
        f"Expected related similarity ({sim_related:.3f}) > "
        f"unrelated ({sim_unrelated:.3f})"
    )

def test_embed_deterministic():

    text = "building a gig marketplace"
    e1 = embed_text(text)
    e2 = embed_text(text)
    assert e1 == e2
