import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { api, apiBase } from '../api.js'
import { ANNOUNCEMENT_CATEGORIES, categoryLabel, formatAnnouncementDate } from '../utils/announcementCategories.js'
import './Announcements.css'

export default function Announcements({ user }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [tab, setTab] = useState('all')

  useEffect(() => {
    api.getAnnouncements()
      .then(setItems)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [])

  const counts = useMemo(() => {
    const c = { all: items.length }
    ANNOUNCEMENT_CATEGORIES.forEach(cat => { c[cat.key] = items.filter(i => i.category === cat.key).length })
    return c
  }, [items])

  const visible = tab === 'all' ? items : items.filter(i => i.category === tab)

  return (
    <div className="page">
      <h2 className="page-h">Announcements</h2>
      <p className="helper">
        News and updates from Mandalink and its creator.
        {user && user.isAdmin && (
          <> <Link to="/admin" className="ann-admin-link">Post an announcement →</Link></>
        )}
      </p>

      <div className="ann-tabs" role="tablist">
        {[{ key: 'all', label: 'All' }, ...ANNOUNCEMENT_CATEGORIES].map(t => (
          <button
            key={t.key}
            role="tab"
            aria-selected={tab === t.key}
            className={`ann-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label} <span className="ann-count">{counts[t.key] ?? 0}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <p className="helper">Loading...</p>
      ) : error ? (
        <p className="helper">Couldn't load announcements right now. Please try again in a moment.</p>
      ) : visible.length === 0 ? (
        <div className="card ann-empty">
          <div className="ann-empty-icon">📣</div>
          <p>{tab === 'all' ? 'No announcements yet.' : `Nothing in ${categoryLabel(tab)} yet.`}</p>
        </div>
      ) : (
        <div className="ann-grid">
          {visible.map(a => (
            <article className="card ann-card" key={a.id}>
              {a.imagePath && (
                <a href={apiBase + a.imagePath} target="_blank" rel="noopener noreferrer">
                  <img className="ann-img" src={apiBase + a.imagePath} alt="" loading="lazy" />
                </a>
              )}
              <div className="ann-body">
                <div className="ann-meta">
                  <span className={`ann-chip ${a.category}`}>{categoryLabel(a.category)}</span>
                  {a.pinned && <span className="ann-pin">📌 Pinned</span>}
                  <span className="ann-date">{formatAnnouncementDate(a.createdAt)}</span>
                </div>
                <h3 className="ann-title">{a.title}</h3>
                {a.body && <p className="ann-text">{a.body}</p>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
