import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './SiteCredit.css'

const SITE = 'https://rayanupadhyay.com'

export default function SiteCredit() {
  const location = useLocation()
  const onHome = location.pathname === '/'

  const [pillOpen, setPillOpen] = useState(() => {
    try { return localStorage.getItem('mandalink_site_pill') !== 'closed' } catch { return true }
  })

  const closePill = () => {
    setPillOpen(false)
    try { localStorage.setItem('mandalink_site_pill', 'closed') } catch { /* ignore */ }
  }

  return (
    <>
      {onHome && (
        <a className="site-sash" href={SITE} target="_blank" rel="noopener noreferrer" aria-label="Visit rayanupadhyay.com">
          <span>rayanupadhyay.com</span>
        </a>
      )}

      {pillOpen && (
        <div className="site-pill" role="note">
          <span className="site-pill-new">New</span>
          <a href={SITE} target="_blank" rel="noopener noreferrer">
            Mandalink has its own world now. Find it at rayanupadhyay.com →
          </a>
          <button type="button" onClick={closePill} aria-label="Dismiss">×</button>
        </div>
      )}

      <footer className="site-credit">
        Built by Rayan Upadhyay ·{' '}
        <a href={SITE} target="_blank" rel="noopener noreferrer">step inside my room at rayanupadhyay.com</a>
      </footer>
    </>
  )
}
