import { useEffect, useState } from 'react'
import './InstallHint.css'

const KEY = 'mandalink_ios_install_hint_dismissed'

// iPhone and iPad Safari only: other iOS browsers (Chrome, Firefox, Edge, the Google app…) can't add a web app this way
function isIosSafari() {
  const ua = navigator.userAgent || ''
  const ios = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  const safari = /Safari\//.test(ua) && !/CriOS|FxiOS|EdgiOS|OPiOS|GSA\/|YaBrowser|DuckDuckGo/.test(ua)
  return ios && safari
}

function isStandalone() {
  return window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches
}

function dismissed() {
  try { return localStorage.getItem(KEY) === '1' } catch (e) { return false }
}

export default function InstallHint() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (!isIosSafari() || isStandalone() || dismissed()) return
    const t = setTimeout(() => setShow(true), 1500)
    return () => clearTimeout(t)
  }, [])

  if (!show) return null

  const close = () => {
    setShow(false)
    try { localStorage.setItem(KEY, '1') } catch (e) {}
  }

  return (
    <div className="install-hint" role="dialog" aria-label="Install Mandalink on your iPhone">
      <img src="/apple-touch-icon.png" alt="" className="install-hint-icon" width="40" height="40" />
      <div className="install-hint-text">
        <b>Install on iPhone</b>
        <span>
          Tap Share{' '}
          <svg className="install-hint-share" viewBox="0 0 24 24" aria-label="(the Share icon)" role="img">
            <path d="M12 3v12M7.5 7.5 12 3l4.5 4.5M5 11v8.5c0 .8.7 1.5 1.5 1.5h11c.8 0 1.5-.7 1.5-1.5V11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          , then Add to Home Screen
        </span>
      </div>
      <button type="button" className="install-hint-close" onClick={close} aria-label="Dismiss">✕</button>
    </div>
  )
}
