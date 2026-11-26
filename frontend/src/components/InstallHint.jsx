import { useEffect, useState } from 'react'
import './InstallHint.css'

import { APK_URL, isAndroid, isIosSafari, isInstalled } from '../utils/platform.js'

const KEYS = { ios: 'mandalink_ios_install_hint_dismissed', android: 'mandalink_android_hint_dismissed' }

function dismissed(kind) {
  try { return localStorage.getItem(KEYS[kind]) === '1' } catch (e) { return false }
}

export default function InstallHint() {
  const [show, setShow] = useState(null)  // null, 'ios' or 'android'

  useEffect(() => {
    if (isInstalled()) return
    const kind = isIosSafari() ? 'ios' : isAndroid() ? 'android' : null
    if (!kind || dismissed(kind)) return
    const t = setTimeout(() => setShow(kind), 1500)
    return () => clearTimeout(t)
  }, [])

  if (!show) return null

  const close = () => {
    try { localStorage.setItem(KEYS[show], '1') } catch (e) {}
    setShow(null)
  }

  if (show === 'android') {
    return (
      <div className="install-hint" role="dialog" aria-label="Get the Mandalink Android app">
        <img src="/apple-touch-icon.png" alt="" className="install-hint-icon" width="40" height="40" />
        <div className="install-hint-text">
          <b>Get the Android app</b>
          <span>Free. Opens Mandalink full-screen from your home screen.</span>
        </div>
        <a className="install-hint-get" href={APK_URL} onClick={close}>Download</a>
        <button type="button" className="install-hint-close" onClick={close} aria-label="Dismiss">✕</button>
      </div>
    )
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
