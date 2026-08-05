import { useState, useEffect, useRef } from 'react'
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
  const googleBtnRef = useRef(null)

  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotMessage, setForgotMessage] = useState(null)
  const [forgotLoading, setForgotLoading] = useState(false)

  const handleGoogleCredential = async (response) => {
    setMessage(null)
    setLoading(true)
    try {
      const result = await api.googleAuth(response.credential)
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

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
    if (!clientId || showForgot) return

    const renderButton = () => {
      if (!window.google || !googleBtnRef.current) return
      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleGoogleCredential
      })
      googleBtnRef.current.innerHTML = ''
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: 'outline',
        size: 'large',
        shape: 'pill',
        width: 320
      })
    }

    if (window.google) {
      renderButton()
    } else {
      const interval = setInterval(() => {
        if (window.google) {
          clearInterval(interval)
          renderButton()
        }
      }, 200)
      return () => clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showForgot, tab])

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
    if (!forgotEmail) {
      setForgotMessage({ type: 'error', text: 'Enter your account email.' })
      return
    }
    setForgotLoading(true)
    setForgotMessage(null)
    try {
      const result = await api.forgotPassword(forgotEmail)
      setForgotMessage({
        type: 'success',
        text: result.message,
        link: result.directResetLink
      })
    } catch (e) {
      setForgotMessage({ type: 'error', text: 'Could not reach the server. Try again.' })
    } finally {
      setForgotLoading(false)
    }
  }

  if (showForgot) {
    return (
      <div className="page">
        <div className="auth-card card">
          <h2 className="page-h" style={{ fontSize: 22, marginBottom: 6 }}>Reset your password</h2>
          <p className="helper">Enter the email on your account and we'll send you a reset link.</p>
          <div className="field">
            <label>Email</label>
            <input value={forgotEmail} onChange={e => setForgotEmail(e.target.value)} placeholder="name@example.com" />
          </div>
          <button className="btn primary" style={{ width: '100%' }} onClick={submitForgot} disabled={forgotLoading}>
            {forgotLoading ? 'Sending...' : 'Send reset link'}
          </button>
          {forgotMessage && (
            <div className={`auth-msg ${forgotMessage.type}`}>
              {forgotMessage.text}
              {forgotMessage.link && (
                <div style={{ marginTop: 8 }}>
                  <a href={forgotMessage.link} className="about-link" style={{ wordBreak: 'break-all' }}>
                    {forgotMessage.link}
                  </a>
                </div>
              )}
            </div>
          )}
          <div className="auth-footer-links">
            <span className="auth-link" onClick={() => { setShowForgot(false); setForgotMessage(null) }}>
              ← Back to login
            </span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="auth-card card">
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
        {message && <div className={`auth-msg ${message.type}`}>{message.text}</div>}

        <div className="auth-divider"><span>or</span></div>
        <div ref={googleBtnRef} className="google-btn-mount"></div>

        {tab === 'login' && (
          <div className="auth-footer-links">
            <span className="auth-link" onClick={() => setShowForgot(true)}>Forgot password?</span>
            <span className="auth-link" onClick={() => navigate('/forgot-username')}>Forgot username?</span>
          </div>
        )}
      </div>
    </div>
  )
}
