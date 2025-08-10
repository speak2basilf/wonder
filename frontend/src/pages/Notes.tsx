import { useState } from 'react'
import api from '../lib/api'

export default function Notes() {
  const [file, setFile] = useState<File | null>(null)
  const [response, setResponse] = useState<any>(null)

  const submit = async () => {
    if (!file) return
    const form = new FormData()
    form.set('audio', file)
    form.set('entity_type', 'lead')
    form.set('entity_id', '00000000-0000-0000-0000-000000000000')
    const { data } = await api.post('/notes/transcribe', form, { headers: { 'Content-Type': 'multipart/form-data' }})
    setResponse(data)
  }

  return (
    <div style={{ padding: 16 }}>
      <h2>Voice Notes</h2>
      <input type="file" accept="audio/*" onChange={e => setFile(e.target.files?.[0] || null)} />
      <button onClick={submit} disabled={!file}>Transcribe</button>
      {response && (<pre>{JSON.stringify(response, null, 2)}</pre>)}
    </div>
  )
}