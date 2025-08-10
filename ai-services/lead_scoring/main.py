from fastapi import FastAPI
from pydantic import BaseModel
import os

app = FastAPI(title="Lead Scoring Service")

class Lead(BaseModel):
    id: str
    source: str | None = None
    expected_value: float | None = None

class PredictRequest(BaseModel):
    lead: dict

class PredictResponse(BaseModel):
    score: float
    explanation: str

@app.post('/predict', response_model=PredictResponse)
def predict(req: PredictRequest):
    lead = req.lead
    ev = float(lead.get('expected_value') or 0.0)
    base = 0.3 if (lead.get('source') == 'web') else 0.2
    score = min(0.95, base + (ev / 100000.0))
    return PredictResponse(score=round(score, 3), explanation=f"Base from source + normalized expected value ({ev})")

@app.get('/health')
def health():
    return {"status":"ok"}