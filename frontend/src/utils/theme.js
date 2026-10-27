import { useState, useEffect } from 'react'

// Two looks: 'v1' (classic) and 'v2' (new). Saved per browser and applied as
// <html data-theme="v2">. index.html applies it before React loads, so there's no flash.
const KEY = 'mandalink_theme'
export const getTheme = () => { try { return localStorage.getItem(KEY) === 'v2' ? 'v2' : 'v1' } catch { return 'v1' } }
export function setTheme(t) {
  try { localStorage.setItem(KEY, t) } catch {}
  document.documentElement.dataset.theme = t
  window.dispatchEvent(new Event('mandalink-theme'))
}
export function useTheme() {
  const [t, setT] = useState(getTheme())
  useEffect(() => {
    const h = () => setT(getTheme())
    window.addEventListener('mandalink-theme', h)
    return () => window.removeEventListener('mandalink-theme', h)
  }, [])
  return [t, setTheme]
}
export const logoFor = t => (t === 'v2' ? '/logo-v2.svg' : '/logo.png')
