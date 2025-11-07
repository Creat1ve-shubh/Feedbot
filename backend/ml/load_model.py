import os
import torch
from transformers import AutoTokenizer
from config import settings

class SentimentModel:
    """
    Wrap your trained model or a fallback HF model.
    For prod, load your TorchScript / ONNX here.
    """
    def __init__(self):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.base_model_id = settings.ML_BASE_MODEL
        self.tokenizer = AutoTokenizer.from_pretrained(self.base_model_id)
        # Fallback: using HF pipeline is simplest; replace with your traced model for speed
        from transformers import pipeline
        self.pipe = pipeline("text-classification", model=self.base_model_id, device=0 if self.device.type=="cuda" else -1)

    def predict(self, texts: list[str]):
        outputs = self.pipe(texts, truncation=True)
        results = []
        for o in outputs:
            label = o["label"]
            score = float(o["score"])
            if label.upper() in ("POSITIVE","LABEL_1"):
                sentiment = "Positive"
                conf = score
            else:
                sentiment = "Negative"
                conf = score
            results.append((sentiment, conf))
        return results

# Singleton loader
_model = None
def get_model() -> SentimentModel:
    global _model
    if _model is None:
        _model = SentimentModel()
    return _model
