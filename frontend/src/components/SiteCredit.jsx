import { useState, useEffect } from 'react'
import './SiteCredit.css'

const SITE = 'https://rayanupadhyay.com'
// Shared announcement file. Edit news.json in the rayanupadhyay.com repo and
// both sites update. The raw GitHub copy is a fallback if the domain is down.
const NEWS_URLS = [
  'https://rayanupadhyay.com/news.json',
  'https://raw.githubusercontent.com/RayanUpadhyay/mywebsite/main/news.json'
]
const DEFAULT_PILL = {
  id: 'site-launch',
  message: 'Mandalink has its own world now. Find it at rayanupadhyay.com',
  link: SITE
}

async function loadNews() {
  for (const url of NEWS_URLS) {
    try {
      const res = await fetch(url, { cache: 'no-store' })
      if (res.ok) return await res.json()
    } catch { /* try the next one */ }
  }
  return null
}

const isLive = n => n && n.message && (!n.until || new Date(n.until + 'T23:59:59') >= new Date())
const dismissedKey = id => `mandalink_pill_closed_${id}`

export default function SiteCredit() {
  const [pill, setPill] = useState(DEFAULT_PILL)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    let cancelled = false
    loadNews().then(n => {
      if (cancelled) return
      const next = isLive(n) ? { id: n.id || n.message, message: n.message, link: n.link, linkText: n.linkText } : DEFAULT_PILL
      setPill(next)
      try { setOpen(localStorage.getItem(dismissedKey(next.id)) !== '1') } catch { setOpen(true) }
    })
    return () => { cancelled = true }
  }, [])

  const close = () => {
    setOpen(false)
    try { localStorage.setItem(dismissedKey(pill.id), '1') } catch { /* ignore */ }
  }

  // Links pointing back at Mandalink stay on this tab; everything else opens a new one.
  const internal = pill.link && /mandalink\.org/i.test(pill.link)
  const href = internal ? '/' : (pill.link || SITE)

  return (
    <>
      {open && (
        <div className="site-pill" role="note">
          <span className="site-pill-new">New</span>
          <a href={href} {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>
            {pill.message}{pill.linkText ? ` · ${pill.linkText}` : ''} →
          </a>
          <button type="button" onClick={close} aria-label="Dismiss">×</button>
        </div>
      )}

      <footer className="site-credit">
        Built by Rayan Upadhyay ·{' '}
        <a href={SITE} target="_blank" rel="noopener noreferrer">step inside my room at rayanupadhyay.com</a>
      </footer>
    </>
  )
}
