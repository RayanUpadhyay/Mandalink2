import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import './Auth.css'

export default function Auth({ onAuth }) {
  const [tab, setTab] = useState('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [showForgot, setShowForgot] = useState(false)
  const [forgotUsername, setForgotUsername] = useState('')
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotNewPassword, setForgotNewPassword] = useState('')
  const [forgotConfirm, setForgotConfirm] = useState('')
  const [forgotMessage, setForgotMessage] = useState(null)
  const [forgotLoading, setForgotLoading] = useState(false)

  const submit = async () => {
    if (!username || !password) {
      setMessage({ type: 'error', text: 'Enter a username and password.' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const result = tab === 'login'
        ? await api.login(username, password)
        : await api.register(username, email, password)

      if (result.success) {
        onAuth(result.user, result.token)
        setMessage({ type: 'success', text: result.message })
        setTimeout(() => navigate('/'), 600)
      } else {
        setMessage({ type: 'error', text: result.message })
      }
    } catch (e) {
      setMessage({ type: 'error', text: 'Could not reach the server. Try again.' })
    } finally {
      setLoading(false)
    }
  }

  const submitForgot = async () => {
    if (!forgotUsername || !forgotEmail) {
      setForgotMessage({ type: 'error', text: 'Enter both your username and email.' })
      return
    }
    if (forgotNewPassword.length < 4) {
      setForgotMessage({ type: 'error', text: 'New password must be at least 4 characters.' })
      return
    }
    if (forgotNewPassword !== forgotConfirm) {
      setForgotMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    setForgotLoading(true)
    setForgotMessage(null)
    try {
      const result = await api.resetPasswordDirect(forgotUsername, forgotEmail, forgotNewPassword)
      setForgotMessage({ type: result.success ? 'success' : 'error', text: result.message })
      if (result.success) {
        setTimeout(() => {
          setShowForgot(false)
          setForgotMessage(null)
          setTab('login')
          setUsername(forgotUsername)
        }, 1200)
      }
    } catch (e) {
      setForgotMessage({ type: 'error', text: 'Could not reach the server. Try again.' })
    } finally {
      setForgotLoading(false)
    }
  }

  if (showForgot) {
    return (
      <div className="page">
        <div className="auth-card">
          <h2 className="page-h" style={{ fontSize: 20, marginBottom: 6 }}>Reset your password</h2>
          <p className="helper">Enter your username and the email on your account, then choose a new password.</p>
          <div className="field">
            <label>Username</label>
            <input value={forgotUsername} onChange={e => setForgotUsername(e.target.value)} placeholder="your username" />
          </div>
          <div className="field">
            <label>Email</label>
            <input value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <div className="field">
            <label>New password</label>
            <input type="password" value={forgotNewPassword} onChange={e => setForgotNewPassword(e.target.value)} placeholder="••••••••" />
          </div>
          <div className="field">
            <label>Confirm new password</label>
            <input type="password" value={forgotConfirm} onChange={e => setForgotConfirm(e.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn primary" style={{ width: '100%' }} onClick={submitForgot} disabled={forgotLoading}>
            {forgotLoading ? 'Please wait...' : 'Reset password'}
          </button>
          {forgotMessage && (
            <div className="auth-msg" style={{ color: forgotMessage.type === 'error' ? 'var(--crimson-bright)' : 'var(--teal)' }}>
              {forgotMessage.text}
            </div>
          )}
          <div style={{ textAlign: 'center', marginTop: 16 }}>
            <span className="auth-link" onClick={() => { setShowForgot(false); setForgotMessage(null) }}>
              ← back to login
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="auth-card">
        <div className="tab-row">
          <div className={`tab ${tab === 'login' ? 'active' : ''}`} onClick={() => setTab('login')}>Login</div>
          <div className={`tab ${tab === 'register' ? 'active' : ''}`} onClick={() => setTab('register')}>Register</div>
        </div>
        <div className="field">
          <label>Username</label>
          <input value={username} onChange={e => setUsername(e.target.value)} placeholder="your username" />
        </div>
        {tab === 'register' && (
          <div className="field">
            <label>Email</label>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" />
          </div>
        )}
        <div className="field">
          <label>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="btn primary" style={{ width: '100%' }} onClick={submit} disabled={loading}>
          {loading ? 'Please wait...' : tab === 'login' ? 'Login' : 'Create account'}
        </button>
        {message && (
          <div className="auth-msg" style={{ color: message.type === 'error' ? 'var(--crimson-bright)' : 'var(--teal)' }}>
            {message.text}
          </div>
        )}
        {tab === 'login' && (
          <div style={{ textAlign: 'center', marginTop: 14 }}>
            <span className="auth-link" onClick={() => setShowForgot(true)}>Forgot password?</span>
          </div>
        )}
      </div>
    </div>
  )
}
