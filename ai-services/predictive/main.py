from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Predictive Analytics Service")

class Point(BaseModel):
    timestamp: str
    value: float

class ForecastRequest(BaseModel):
    series: List[Point]
    horizon: int = 6

class ForecastResponse(BaseModel):
    forecast: List[Point]

@app.post('/forecast', response_model=ForecastResponse)
def forecast(req: ForecastRequest):
    series = req.series
    if not series:
        return {"forecast": []}
    last = series[-1].value
    growth = 0.05 * (sum(p.value for p in series[-3:]) / max(1, len(series[-3:])))
    out = []
    for i in range(req.horizon):
        last = last + growth
        out.append(Point(timestamp=f"t+{i+1}", value=round(last, 2)))
    return ForecastResponse(forecast=out)

@app.get('/health')
def health():
    return {"status":"ok"}