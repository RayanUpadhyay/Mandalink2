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
      </div>
    </div>
  )
}
