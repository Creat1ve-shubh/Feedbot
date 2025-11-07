from typing import List, Dict
from ml.load_model import get_model

# Minimal emotion/topic/summary placeholders.
# Replace with your Kaggle batch pipeline when artifacts are ready.
def simple_emotions(text: str) -> list[str]:
    t = text.lower()
    if any(w in t for w in ["love","great","awesome","amazing","best","comfort","design"]): return ["Joy"]
    if any(w in t for w in ["hate","worst","terrible","issue","bug","late","expensive"]): return ["Frustration"]
    return ["Neutral"]

def simple_topics(text: str) -> list[str]:
    t = text.lower()
    out = []
    if any(w in t for w in ["price","expensive","pricing"]): out.append("Pricing")
    if any(w in t for w in ["comfort","fit","cushion"]): out.append("Comfort")
    if any(w in t for w in ["delivery","shipping","late"]): out.append("Delivery")
    if not out: out.append("General")
    return out

def simple_intent(text: str) -> str:
    t = text.lower()
    if any(w in t for w in ["how to","please","help","where"]): return "Query"
    if any(w in t for w in ["hate","worst","terrible","issue","bug","complaint"]): return "Complaint"
    if any(w in t for w in ["love","awesome","amazing","best","great"]): return "Praise"
    return "Feedback"

def simple_summary(brand: str, text: str) -> str:
    t = text.lower()
    if "expensive" in t or "price" in t:
        return f"Users like {brand} but find it expensive."
    if "comfort" in t or "fit" in t:
        return f"Users praise {brand}'s comfort and fit."
    return f"General feedback about {brand}."

def batch_interpret(records: List[Dict]) -> List[Dict]:
    """
    records: rows from DB with keys: id, brand, text, clean_text
    Returns: list of enriched rows with ML fields filled.
    """
    model = get_model()
    texts = [r["clean_text"] for r in records]
    preds = model.predict(texts)

    out = []
    for r, (sentiment, conf) in zip(records, preds):
        emotions = simple_emotions(r["clean_text"])
        topics = simple_topics(r["clean_text"])
        intent = simple_intent(r["text"])
        summary = simple_summary(r["brand"], r["text"])
        pol_score = 0.0
        if sentiment == "Positive": pol_score = conf
        if sentiment == "Negative": pol_score = -conf

        out.append({
            "id": r["id"],
            "sentiment": "Mixed" if conf < 0.7 else sentiment,
            "confidence": int(round(conf * 100)),
            "emotion": emotions,
            "topics": topics,
            "intent": intent,
            "summary": summary,
            "polarity_score": pol_score,
        })
    return out
