import { useState, useRef, useEffect } from 'react'
import { api } from '../api.js'
import './AiHelp.css'

export default function AiHelp() {
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! Ask me anything about Chinese radicals — meanings, stroke order, or how they combine into bigger characters.' }
  ])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const logRef = useRef(null)

  useEffect(() => {
    if (logRef.current) logRef.current.scrollTop = logRef.current.scrollHeight
  }, [messages])

  const send = async () => {
    const text = input.trim()
    if (!text || sending) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setSending(true)
    try {
      const result = await api.chat(text)
      setMessages(m => [...m, { role: 'ai', text: result.reply }])
    } catch {
      setMessages(m => [...m, { role: 'ai', text: 'Something went wrong reaching the AI tutor. Try again in a moment.' }])
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="page">
      <h2 className="page-h">AI help</h2>
      <p className="helper">Ask about any radical, stroke order, or pronunciation.</p>
      <div className="chat-wrap">
        <div id="chatLog" ref={logRef}>
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              <div className="bubble">{m.text}</div>
            </div>
          ))}
        </div>
        <div className="chat-input">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask about any radical..."
          />
          <button className="btn primary" onClick={send} disabled={sending}>
            {sending ? '...' : 'send'}
          </button>
        </div>
      </div>
    </div>
  )
}
