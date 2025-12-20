# ml/load_model.py
import os
import torch
from transformers import AutoTokenizer, pipeline
from config import settings
import traceback

# Config: allow overriding via ENV, keep defaults from settings
MODEL_PATH = os.environ.get("ML_MODEL_PATH", getattr(settings, "ML_MODEL_PATH", "./models/model_traced.pt"))
STATE_DICT_PATH = os.environ.get("ML_STATE_DICT_PATH", getattr(settings, "ML_STATE_DICT_PATH", "./models/best_model_f1_0.8170.pt"))
TOKENIZER_DIR = os.environ.get("TOKENIZER_DIR", getattr(settings, "ML_TOKENIZER_DIR", "./models/tokenizer"))
BASE_MODEL_ID = os.environ.get("ML_BASE_MODEL", getattr(settings, "ML_BASE_MODEL", "distilbert-base-uncased"))
DEVICE = torch.device("cuda" if torch.cuda.is_available() else "cpu")
MAX_LEN = int(os.environ.get("ML_MAX_LEN", 256))


class SentimentModel:
    def __init__(self, model=None, tokenizer=None, use_traced=False):
        self.use_traced = bool(use_traced)
        self.model = model
        self.tokenizer = tokenizer
        self.model_type = "traced" if use_traced else "python_or_pipeline"

        # ensure model is on the right device and in eval mode where applicable
        try:
            if isinstance(self.model, torch.nn.Module) or isinstance(self.model, torch.jit.ScriptModule):
                self.model.to(DEVICE)
                self.model.eval()
        except Exception:
            pass

    def _call_traced(self, toks):
        """Call traced model robustly: try kwargs, then positional, then tuple."""
        toks = {k: v.to(DEVICE) for k, v in toks.items()}
        with torch.no_grad():
            # Try kwargs first
            try:
                out = self.model(**toks)
                return out
            except Exception as e_kw:
                # try positional (input_ids, attention_mask)
                try:
                    inp = toks.get("input_ids")
                    mask = toks.get("attention_mask")
                    if inp is not None and mask is not None:
                        out = self.model(inp, mask)
                        return out
                except Exception as e_pos:
                    # try passing tuple of all tensors
                    try:
                        args = tuple(toks.values())
                        out = self.model(*args)
                        return out
                    except Exception as e_all:
                        tb = ("kwargs_error:\n" + "".join(traceback.format_exception_only(type(e_kw), e_kw)) +
                              "\npositional_error:\n" + "".join(traceback.format_exception_only(type(e_pos), e_pos)) +
                              "\nall_args_error:\n" + "".join(traceback.format_exception_only(type(e_all), e_all)))
                        raise RuntimeError("Failed to call traced model. Summary:\n" + tb)

    def predict(self, texts):
        single = False
        if isinstance(texts, str):
            texts = [texts]
            single = True
        if not texts:
            return [] if not single else ("Negative", 0.0)

        # HF pipeline path
        if not self.use_traced:
            if self.model is None:
                raise RuntimeError("No pipeline/model available for inference.")
            outputs = self.model(texts, truncation=True)
            results = []
            for o in outputs:
                label = o.get("label", "")
                score = float(o.get("score", 0.0))
                l = label.upper()
                if l in ("POSITIVE", "LABEL_1"):
                    results.append(("Positive", score))
                else:
                    results.append(("Negative", score))
            return results[0] if single else results

        # traced model path
        if self.tokenizer is None:
            raise RuntimeError("Tokenizer not available for traced model path.")
        toks = self.tokenizer(
            texts,
            return_tensors="pt",
            padding=True,
            truncation=True,
            max_length=MAX_LEN,
        )
        out = self._call_traced(toks)

        # normalize outputs -> logits tensor
        logits = out
        if isinstance(out, dict):
            if "logits" in out:
                logits = out["logits"]
            else:
                for v in out.values():
                    logits = v
                    break
        elif isinstance(out, (list, tuple)):
            logits = out[0]

        probs = torch.softmax(logits, dim=-1).cpu()
        results = []
        for row in probs:
            score, idx = torch.max(row, dim=-1)
            label = "Positive" if int(idx.item()) == 1 else "Negative"
            results.append((label, float(score.item())))
        return results[0] if single else results


# Factory that loads model and tokenizer once
_singleton = None


def get_model() -> SentimentModel:
    global _singleton
    if _singleton is not None:
        return _singleton

    # Try to load tokenizer from local TOKENIZER_DIR first (preferred)
    tokenizer = None
    if os.path.isdir(TOKENIZER_DIR):
        try:
            print(f"[INFO] Loading tokenizer from local dir: {TOKENIZER_DIR}")
            tokenizer = AutoTokenizer.from_pretrained(TOKENIZER_DIR, use_fast=True)
        except Exception as e:
            print(f"[WARN] Failed loading tokenizer from {TOKENIZER_DIR}: {e}")

    # Fallback to base model id tokenizer (explicit)
    if tokenizer is None:
        print(f"[INFO] Loading tokenizer from base model id: {BASE_MODEL_ID}")
        tokenizer = AutoTokenizer.from_pretrained(BASE_MODEL_ID, use_fast=True)

    # Try traced model first
    if MODEL_PATH and os.path.exists(MODEL_PATH):
        try:
            print(f"[INFO] Attempting to load TorchScript traced model at: {MODEL_PATH}")
            traced = torch.jit.load(MODEL_PATH, map_location=DEVICE)
            traced.eval()
            wrapper = SentimentModel(model=traced, tokenizer=tokenizer, use_traced=True)
            try:
                wrapper.predict("warmup")
            except Exception as e:
                print("[WARN] Warmup for traced model failed:", e)
            _singleton = wrapper
            print("[INFO] ✓ Traced model loaded and wrapper created.")
            return _singleton
        except Exception as e:
            print(f"[WARNING] Failed to load traced model: {type(e).__name__}: {e}")
            traceback.print_exc()

    # Fallback: use HF pipeline (text-classification)
    try:
        device_arg = 0 if DEVICE.type == "cuda" else -1
        print(f"[INFO] Loading HF pipeline fallback (device={device_arg}) using model id: {BASE_MODEL_ID}")
        hf_pipe = pipeline("text-classification", model=BASE_MODEL_ID, device=device_arg)
        wrapper = SentimentModel(model=hf_pipe, tokenizer=tokenizer, use_traced=False)
        try:
            wrapper.predict("warmup")
        except Exception as e:
            print("[WARN] Warmup for HF pipeline failed:", e)
        _singleton = wrapper
        print("[INFO] ✓ HF pipeline loaded and wrapper created.")
        return _singleton
    except Exception as e:
        print(f"[ERROR] Failed to load HF pipeline fallback: {type(e).__name__}: {e}")
        traceback.print_exc()

    raise RuntimeError("Failed to initialize any model (traced nor pipeline). Check logs.")
