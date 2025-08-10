import { useState } from 'react'

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<string[]>([])
  const [input, setInput] = useState('')

  return (
    <div style={{ position: 'fixed', right: 16, bottom: 16 }}>
      {open && (
        <div style={{ width: 300, height: 360, background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: 8 }}>
          <div style={{ height: 300, overflow: 'auto' }}>
            {messages.map((m, i) => (<div key={i} style={{ margin: 4 }}>{m}</div>))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input value={input} onChange={e => setInput(e.target.value)} style={{ flex: 1 }} />
            <button onClick={() => { setMessages(m => [...m, input]); setInput('') }}>Send</button>
          </div>
        </div>
      )}
      <button onClick={() => setOpen(o => !o)}>{open ? 'Close' : 'Chat'}</button>
    </div>
  )
}