from data.questions import QUESTIONS, DIMENSIONS
from data.careers import CAREERS


def compute_trait_scores(answers: dict) -> dict:
    """Turn 1-5 Likert answers into a 0-100 score per dimension."""
    buckets = {d: [] for d in DIMENSIONS}
    for q in QUESTIONS:
        value = answers.get(q["id"])
        if value is None:
            continue
        buckets[q["dimension"]].append(value)

    scores = {}
    for dim, values in buckets.items():
        if not values:
            scores[dim] = 50  # neutral default if unanswered
            continue
        avg = sum(values) / len(values)          # 1..5
        scores[dim] = round(((avg - 1) / 4) * 100)  # scale to 0..100
    return scores


def compute_career_matches(trait_scores: dict, top_n: int = 5):
    results = []
    for career in CAREERS:
        weights = career["weights"]
        # weighted cosine-like similarity: how well the student's profile
        # covers what this career actually needs
        num = sum(trait_scores.get(dim, 50) * w for dim, w in weights.items())
        denom_a = sum(v * v for v in trait_scores.values()) ** 0.5
        denom_b = sum(w * w for w in weights.values()) ** 0.5
        similarity = num / (denom_a * denom_b) if denom_a and denom_b else 0
        score = round(max(0, min(1, similarity)) * 100)
        results.append({
            "id": career["id"],
            "name": career["name"],
            "score": score,
            "reason": career["reason"],
        })

    results.sort(key=lambda r: r["score"], reverse=True)
    return results[:top_n]
