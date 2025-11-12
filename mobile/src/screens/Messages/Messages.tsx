import React, { useMemo, useState } from 'react'
import './Messages.css'

type Thread = { id: string; title: string; last: string }
type ChatMsg = { id: string; threadId: string; role: 'me' | 'other'; text: string; ts: string }

const THREADS: Thread[] = [
  { id: 't1', title: 'Jan Kowalski — zlecenie o2', last: 'Proszę o potwierdzenie terminu' },
  { id: 't2', title: 'Recepcja — Dostawa części', last: 'Dostawca potwierdził jutro 10:00' },
  { id: 't3', title: 'Marek Mechanik', last: 'Auto gotowe do odbioru' },
]

const MSGS: ChatMsg[] = [
  { id: 'm1', threadId: 't1', role: 'other', text: 'Dzień dobry, czy 18.11 o 8:00 pasuje?', ts: '2025-11-12T09:00:00' },
  { id: 'm2', threadId: 't1', role: 'me', text: 'Tak, potwierdzam termin.', ts: '2025-11-12T09:05:00' },
  { id: 'm3', threadId: 't2', role: 'other', text: 'Dostawa tarcz i klocków jutro 10:00.', ts: '2025-11-12T08:10:00' },
  { id: 'm4', threadId: 't3', role: 'other', text: 'Naprawa zakończona, jazda próbna OK.', ts: '2025-11-11T17:20:00' },
]

export default function Messages() {
  const [active, setActive] = useState('t1')
  const [text, setText] = useState('')
  const [all, setAll] = useState(MSGS)

  const threads = useMemo(() => THREADS, [])
  const convo = useMemo(() => all.filter(m => m.threadId === active).sort((a,b)=>a.ts.localeCompare(b.ts)), [all, active])

  const send = () => {
    if (!text.trim()) return
    setAll(prev => [...prev, { id: `m${prev.length+1}`, threadId: active, role: 'me', text: text.trim(), ts: new Date().toISOString() }])
    setText('')
  }

  return (
    <div className="msg-container">
      <div className="msg-left">
        <div className="msg-left-head">Wiadomości</div>
        <div className="thread-list">
          {threads.map(t => (
            <button key={t.id} className={`thread ${t.id === active ? 'active' : ''}`} onClick={() => setActive(t.id)}>
              <div className="t-title">{t.title}</div>
              <div className="t-last">{t.last}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="msg-right">
        <div className="conv">
          {convo.map(m => (
            <div key={m.id} className={`line ${m.role}`}>
              <div className="bubble">{m.text}</div>
              <div className="ts">{new Date(m.ts).toLocaleString()}</div>
            </div>
          ))}
        </div>
        <div className="composer">
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Napisz wiadomość…" />
          <button className="msg-btn-primary" onClick={send}>Wyślij</button>
        </div>
      </div>
    </div>
  )
}
