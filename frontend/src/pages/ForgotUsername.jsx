import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import './Auth.css'

export default function ForgotUsername() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async () => {
    if (!email) {
      setMessage({ type: 'error', text: 'Enter your account email.' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const result = await api.forgotUsername(email)
      setMessage({
        type: 'success',
        text: result.message,
        username: result.directUsername
      })
    } catch (e) {
      setMessage({ type: 'error', text: 'Could not reach the server. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="auth-card card">
        <h2 className="page-h" style={{ fontSize: 22, marginBottom: 6 }}>Forgot your username?</h2>
        <p className="helper">Enter the email on your account and we'll send you your username.</p>
        <div className="field">
          <label>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
        </div>
        <button className="btn primary" style={{ width: '100%' }} onClick={submit} disabled={loading}>
          {loading ? 'Sending...' : 'Send username'}
        </button>
        {message && (
          <div className={`auth-msg ${message.type}`}>
            {message.text}
            {message.username && (
              <div style={{ marginTop: 8, fontWeight: 700 }}>{message.username}</div>
            )}
          </div>
        )}
        <div className="auth-footer-links">
          <span className="auth-link" onClick={() => navigate('/auth')}>← Back to login</span>
        </div>
      </div>
    </div>
  )
}
