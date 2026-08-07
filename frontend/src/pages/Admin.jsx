import { useState, useEffect } from 'react'
import { api } from '../api.js'
import './Admin.css'

export default function Admin() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [message, setMessage] = useState(null)

  const [dropName, setDropName] = useState('')
  const [dropIcon, setDropIcon] = useState('')
  const [dropDesc, setDropDesc] = useState('')
  const [dropBusy, setDropBusy] = useState(false)
  const [dropMessage, setDropMessage] = useState(null)

  const load = () => {
    api.getAdminStats()
      .then(setData)
      .catch(() => setData({ authorized: false, message: 'Could not reach the server.' }))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const toggleAdmin = async (u) => {
    setBusyId(u.id)
    setMessage(null)
    try {
      const result = await api.setAdmin(u.id, !u.isAdmin)
      setMessage({ type: result.success ? 'success' : 'error', text: result.message })
      if (result.success) load()
    } catch (e) {
      setMessage({ type: 'error', text: 'Could not reach the server.' })
    } finally {
      setBusyId(null)
    }
  }

  const submitDrop = async () => {
    if (!dropName || !dropIcon) {
      setDropMessage({ type: 'error', text: 'Name and icon are required.' })
      return
    }
    setDropBusy(true)
    setDropMessage(null)
    try {
      const result = await api.createBadgeDrop(dropName, dropIcon, dropDesc)
      setDropMessage({ type: result.success ? 'success' : 'error', text: result.message })
      if (result.success) {
        setDropName(''); setDropIcon(''); setDropDesc('')
        load()
      }
    } catch (e) {
      setDropMessage({ type: 'error', text: 'Could not reach the server.' })
    } finally {
      setDropBusy(false)
    }
  }

  const endDropNow = async () => {
    setDropBusy(true)
    setDropMessage(null)
    try {
      const result = await api.endBadgeDrop()
      setDropMessage({ type: result.success ? 'success' : 'error', text: result.message })
      if (result.success) load()
    } catch (e) {
      setDropMessage({ type: 'error', text: 'Could not reach the server.' })
    } finally {
      setDropBusy(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <h2 className="page-h">Admin</h2>
        <p className="helper">Loading...</p>
      </div>
    )
  }

  if (!data || !data.authorized) {
    return (
      <div className="page">
        <h2 className="page-h">Admin</h2>
        <div className="card admin-denied">
          <p className="helper" style={{ margin: 0 }}>
            You don't have access to this page. If this seems wrong, ask an existing admin to grant your account access.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      <h2 className="page-h">Admin</h2>
      <p className="helper">Real, live data from the database — no simulated numbers.</p>

      <div className="admin-stat-row">
        <div className="card admin-stat">
          <div className="admin-stat-num">{data.totalUsers}</div>
          <div className="admin-stat-label">Registered users</div>
        </div>
        <div className="card admin-stat">
          <div className="admin-stat-num">{data.activeUsers24h ?? 0}</div>
          <div className="admin-stat-label">Active (24h)</div>
        </div>
        <div className="card admin-stat">
          <div className="admin-stat-num">{data.activeUsers7d ?? 0}</div>
          <div className="admin-stat-label">Active (7 days)</div>
        </div>
        <div className="card admin-stat">
          <div className="admin-stat-num">{data.totalPageViews ?? 0}</div>
          <div className="admin-stat-label">Total page views</div>
        </div>
        <div className="card admin-stat">
          <div className="admin-stat-num">{data.totalRadicals}</div>
          <div className="admin-stat-label">Total characters</div>
        </div>
      </div>

      {message && (
        <div className={`admin-msg ${message.type}`}>{message.text}</div>
      )}

      <div className="card admin-table-card" style={{ marginBottom: 20 }}>
        <h3 style={{ margin: '0 0 14px' }}>Limited badge drop</h3>
        {data.activeDrop ? (
          <div className="admin-active-drop">
            <div className="admin-active-drop-info">
              <span style={{ fontSize: 24 }}>{data.activeDrop.icon}</span>
              <div>
                <div style={{ fontWeight: 700 }}>{data.activeDrop.name}</div>
                <div className="helper" style={{ margin: 0 }}>{data.activeDrop.description}</div>
              </div>
            </div>
            <button className="btn" disabled={dropBusy} onClick={endDropNow}>End drop now</button>
          </div>
        ) : (
          <>
            <p className="helper">No active drop. Create one — it'll be live for exactly 24 hours.</p>
            <div className="admin-drop-form">
              <input
                className="admin-drop-input"
                placeholder="Icon (emoji)"
                value={dropIcon}
                onChange={e => setDropIcon(e.target.value)}
                style={{ maxWidth: 90 }}
              />
              <input
                className="admin-drop-input"
                placeholder="Badge name"
                value={dropName}
                onChange={e => setDropName(e.target.value)}
              />
              <input
                className="admin-drop-input"
                placeholder="Description (optional)"
                value={dropDesc}
                onChange={e => setDropDesc(e.target.value)}
              />
              <button className="btn primary" disabled={dropBusy} onClick={submitDrop}>
                {dropBusy ? 'Creating...' : 'Launch drop'}
              </button>
            </div>
          </>
        )}
        {dropMessage && (
          <div className={`admin-msg ${dropMessage.type}`} style={{ marginTop: 12 }}>{dropMessage.text}</div>
        )}
      </div>

      {data.topPages && data.topPages.length > 0 && (
        <div className="card admin-table-card" style={{ marginBottom: 20 }}>
          <h3 style={{ margin: '0 0 14px' }}>Most visited pages</h3>
          <div className="admin-toppages-list">
            {data.topPages.map(p => (
              <div key={p.path} className="admin-toppage-row">
                <span className="admin-toppage-path">{p.path === '/' ? 'Home' : p.path}</span>
                <span className="admin-toppage-count">{p.views} views</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="card admin-table-card">
        <h3 style={{ margin: '0 0 14px' }}>All users</h3>
        <div className="admin-table-scroll">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>XP</th>
                <th>Level</th>
                <th>Sign-in method</th>
                <th>Joined</th>
                <th>Admin</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map(u => (
                <tr key={u.id}>
                  <td>{u.username}</td>
                  <td>{u.email}</td>
                  <td>{u.xp}</td>
                  <td>{u.level}</td>
                  <td>{u.authProvider === 'google' ? 'Google' : 'Password'}</td>
                  <td>{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '—'}</td>
                  <td>
                    <button
                      className={`admin-toggle-btn ${u.isAdmin ? 'is-admin' : ''}`}
                      disabled={busyId === u.id}
                      onClick={() => toggleAdmin(u)}
                    >
                      {u.isAdmin ? '✓ Admin' : 'Grant admin'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="helper admin-note">
        "Active" counts unique visitors (by account, or by browser session if logged out) who
        loaded at least one page in that window. Tracking started when this feature was added,
        so historical data from before that isn't included.
      </p>
    </div>
  )
}
