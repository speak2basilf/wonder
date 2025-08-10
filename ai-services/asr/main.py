from fastapi import FastAPI
from pydantic import BaseModel
import base64, os

app = FastAPI(title="ASR Service")

class TranscribeRequest(BaseModel):
    audio_base64: str

class TranscribeResponse(BaseModel):
    transcript: str

@app.post('/transcribe', response_model=TranscribeResponse)
def transcribe(req: TranscribeRequest):
    b = base64.b64decode(req.audio_base64)
    # Try OpenAI Whisper if key present; otherwise stub a response
    try:
        key = os.getenv('OPENAI_API_KEY')
        if key:
            from openai import OpenAI
            client = OpenAI(api_key=key)
            # Write temp file
            tmp = '/tmp/audio.wav'
            with open(tmp, 'wb') as f:
                f.write(b)
            with open(tmp, 'rb') as f:
                resp = client.audio.transcriptions.create(model="whisper-1", file=f)
            text = resp.text
            return TranscribeResponse(transcript=text)
    except Exception:
        pass
    return TranscribeResponse(transcript="[Transcript unavailable in dev stub]")

@app.get('/health')
def health():
    return {"status":"ok"}