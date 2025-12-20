import os
import json
import torch
from transformers import AutoTokenizer
from ml.model_def import TransformerLSTM   # <-- you will add this in step 3

BASE_DIR = os.path.join(os.path.dirname(__file__), "custom_model")

class CustomSentiment:
    def __init__(self):
        self.device = torch.device("cpu")
        
        # Load meta
        meta_path = os.path.join(BASE_DIR, "model_meta.json")
        with open(meta_path, "r") as f:
            meta = json.load(f)

        self.model_name = meta["model_name"]

        # Load tokenizer
        self.tokenizer = AutoTokenizer.from_pretrained(
            os.path.join(BASE_DIR, "tokenizer")
        )

        # Init model
        self.model = TransformerLSTM(transformer_name=self.model_name)
        state = torch.load(os.path.join(BASE_DIR, "best_model_state.pt"), map_location="cpu")["model_state"]
        self.model.load_state_dict(state)
        self.model.eval()
        self.model.to(self.device)

    def predict(self, texts):
        if not texts:
            return []

        enc = self.tokenizer(
            texts,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=256
        )

        enc = {k: v.to(self.device) for k, v in enc.items()}

        with torch.no_grad():
            logits = self.model(enc["input_ids"], enc["attention_mask"])

        probs = torch.softmax(logits, dim=-1).cpu()
        
        results = []
        for row in probs:
            score, idx = torch.max(row, dim=-1)
            sentiment = "Positive" if idx.item() == 1 else "Negative"
            results.append((sentiment, float(score)))
        return results


# singleton
_model = None

def get_custom_model():
    global _model
    if _model is None:
        _model = CustomSentiment()
    return _model
