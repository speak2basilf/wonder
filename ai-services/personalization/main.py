from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

app = FastAPI(title="Personalization Service")

class Context(BaseModel):
    lead_status: str | None = None
    sentiment: str | None = None
    last_contact_days: int | None = None

class NBARequest(BaseModel):
    context: Context

class Action(BaseModel):
    type: str
    label: str
    confidence: float

class NBAResponse(BaseModel):
    actions: List[Action]

@app.post('/next-best-actions', response_model=NBAResponse)
def next_best_actions(req: NBARequest):
    ctx = req.context
    actions: List[Action] = []
    if ctx.sentiment == 'NEGATIVE':
        actions.append(Action(type='call', label='Schedule a support call within 24h', confidence=0.8))
    else:
        actions.append(Action(type='email', label='Send tailored follow-up email', confidence=0.7))
    if (ctx.last_contact_days or 0) > 14:
        actions.append(Action(type='whatsapp', label='Quick WhatsApp check-in', confidence=0.6))
    return NBAResponse(actions=actions)

@app.get('/health')
def health():
    return {"status":"ok"}