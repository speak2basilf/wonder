import { useMutation, useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useState } from 'react'

export default function Campaigns() {
  const { data } = useQuery({ queryKey: ['campaigns'], queryFn: async () => (await api.get('/campaigns')).data })
  const [prompt, setPrompt] = useState('Write a friendly follow-up email for a clinical trial lead about scheduling a call.')
  const gen = useMutation({ mutationFn: async () => (await api.post('/campaigns/generate', { prompt })).data })

  return (
    <div style={{ padding: 16 }}>
      <h2>Campaigns</h2>
      <div>
        <textarea style={{ width: '100%', height: 120 }} value={prompt} onChange={e => setPrompt(e.target.value)} />
        <button onClick={() => gen.mutate()}>Generate Content</button>
        {gen.data?.content && (<pre>{gen.data.content}</pre>)}
      </div>
      <h3>Existing</h3>
      <ul>
        {data?.map((c: any) => (
          <li key={c.id}>{c.name} - {c.channel} - {c.status}</li>
        ))}
      </ul>
    </div>
  )
}