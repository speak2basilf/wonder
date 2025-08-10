from fastapi import FastAPI
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Sentiment Service")

try:
    from transformers import pipeline
    _clf = pipeline("sentiment-analysis")
except Exception:
    _clf = None

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    label: str
    score: float

@app.post('/analyze', response_model=AnalyzeResponse)
def analyze(req: AnalyzeRequest):
    text = req.text.strip()
    if _clf:
        out = _clf(text)[0]
        return AnalyzeResponse(label=out['label'], score=float(out['score']))
    # Fallback simple heuristic
    label = 'POSITIVE' if any(w in text.lower() for w in ['good','great','thanks','appreciate']) else 'NEGATIVE' if any(w in text.lower() for w in ['bad','angry','upset','terrible']) else 'NEUTRAL'
    score = 0.75 if label != 'NEUTRAL' else 0.5
    return AnalyzeResponse(label=label, score=score)

@app.get('/health')
def health():
    return {"status":"ok"}