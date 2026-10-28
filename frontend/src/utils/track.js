import { useState, useEffect } from 'react'
import { api } from '../api.js'

// Study track: what the learner is studying for. It only changes which course
// the site puts first (nav order, Home cards). Every feature stays reachable on
// every track, and it's separate from the V1/V2 look.
// Saved in this browser, and on the account when logged in.
export const TRACKS = {
  general: { id: 'general', glyph: '学', name: 'General learning', blurb: 'Radicals, characters and everyday Chinese at your own pace.' },
  ib: { id: 'ib', glyph: '文', name: 'IB Chinese B', blurb: 'Unit-by-unit course for SL and HL, with exam-style practice.' },
  igcse: { id: 'igcse', glyph: '考', name: 'IGCSE Chinese', blurb: 'Exam course in progress. Pick this to see it first when it launches.' }
}

const KEY = 'mandalink_track'
const valid = t => (t && TRACKS[t] ? t : null)

export const getTrack = () => { try { return valid(localStorage.getItem(KEY)) } catch { return null } }

// Store locally and tell every component using useTrack().
export function applyTrackLocally(t) {
  if (!valid(t)) return
  try { localStorage.setItem(KEY, t) } catch {}
  window.dispatchEvent(new Event('mandalink-track'))
}

// User choice: store locally, and save to the account if logged in.
export function setTrack(t) {
  if (!valid(t)) return
  applyTrackLocally(t)
  if (localStorage.getItem('mandalink_token')) api.changeTrack(t).catch(() => {})
}

export function useTrack() {
  const [t, setT] = useState(getTrack())
  useEffect(() => {
    const h = () => setT(getTrack())
    window.addEventListener('mandalink-track', h)
    return () => window.removeEventListener('mandalink-track', h)
  }, [])
  return [t, setTrack]
}

// Where each track's course lives.
export const courseLink = t => (t === 'igcse' ? { to: '/igcse', label: 'IGCSE' } : { to: '/ib', label: 'IB' })
