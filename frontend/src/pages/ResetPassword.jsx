import { useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { api } from '../api.js'
import './Auth.css'

export default function ResetPassword() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') || ''
  const [newPassword, setNewPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const submit = async () => {
    if (!token) {
      setMessage({ type: 'error', text: 'This reset link is missing its token.' })
      return
    }
    if (newPassword.length < 4) {
      setMessage({ type: 'error', text: 'Password must be at least 4 characters.' })
      return
    }
    if (newPassword !== confirm) {
      setMessage({ type: 'error', text: 'Passwords do not match.' })
      return
    }
    setLoading(true)
    setMessage(null)
    try {
      const result = await api.resetPassword(token, newPassword)
      if (result.success) {
        setMessage({ type: 'success', text: result.message })
        setTimeout(() => navigate('/auth'), 1500)
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
      <div className="auth-card card">
        <h2 className="page-h" style={{ fontSize: 22, marginBottom: 6 }}>Set a new password</h2>
        <p className="helper">Choose a new password for your account.</p>
        <div className="field">
          <label>New password</label>
          <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="••••••••" />
        </div>
        <div className="field">
          <label>Confirm password</label>
          <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
        </div>
        <button className="btn primary" style={{ width: '100%' }} onClick={submit} disabled={loading}>
          {loading ? 'Please wait...' : 'Reset password'}
        </button>
        {message && <div className={`auth-msg ${message.type}`}>{message.text}</div>}
      </div>
    </div>
  )
}
