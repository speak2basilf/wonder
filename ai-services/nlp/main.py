from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
import os

app = FastAPI(title="NLP Service")

class GenerateRequest(BaseModel):
    prompt: str

class GenerateResponse(BaseModel):
    content: str

class SearchRequest(BaseModel):
    query: str

class SearchHit(BaseModel):
    id: str
    score: float
    metadata: dict

class SearchResponse(BaseModel):
    hits: List[SearchHit]

@app.post('/generate', response_model=GenerateResponse)
def generate(req: GenerateRequest):
    # Minimal, use OpenAI if key provided else stub
    try:
        from openai import OpenAI
        key = os.getenv('OPENAI_API_KEY')
        if key:
            client = OpenAI(api_key=key)
            resp = client.chat.completions.create(model="gpt-4o-mini", messages=[{"role":"user","content":req.prompt}], temperature=0.7)
            text = resp.choices[0].message.content
            return GenerateResponse(content=text)
    except Exception:
        pass
    return GenerateResponse(content=f"[DRAFT] {req.prompt}\n\n- Subject: ...\n- Body: ...")

@app.post('/search', response_model=SearchResponse)
def search(req: SearchRequest):
    # Stubbed vector search; integrate Pinecone in production
    try:
        from pinecone import Pinecone
        api_key = os.getenv('PINECONE_API_KEY')
        index_name = os.getenv('PINECONE_INDEX', 'cliniglobal-crm')
        if api_key:
            pc = Pinecone(api_key=api_key)
            index = pc.Index(index_name)
            # naive embedding using OpenAI if present
            from openai import OpenAI
            client = OpenAI(api_key=os.getenv('OPENAI_API_KEY'))
            emb = client.embeddings.create(model="text-embedding-3-small", input=req.query)
            vec = emb.data[0].embedding
            results = index.query(vector=vec, top_k=5, include_metadata=True)
            hits = [SearchHit(id=m.id, score=m.score, metadata=m.metadata or {}) for m in results.matches]
            return SearchResponse(hits=hits)
    except Exception:
        pass
    return SearchResponse(hits=[])

@app.get('/health')
def health():
    return {"status":"ok"}