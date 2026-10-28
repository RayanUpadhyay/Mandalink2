import { UNIT1 } from './unit1.js'

// IB progress, saved in this browser. Shared by the IB pages and the Home "continue" card.
export const UNITS = { u1: UNIT1 }
const PKEY = 'mandalink_ib_progress'
export const loadProgress = () => { try { return JSON.parse(localStorage.getItem(PKEY)) || {} } catch { return {} } }
export const saveProgress = (unitId, sectionId, score, total) => {
  const p = loadProgress(); p[`${unitId}/${sectionId}`] = { score, total, at: Date.now() }
  try { localStorage.setItem(PKEY, JSON.stringify(p)) } catch {}
}

// First unfinished section across the built units, for "Continue where you left off".
export function nextIbStep() {
  const p = loadProgress()
  for (const unit of Object.values(UNITS)) {
    const done = unit.sections.filter(s => p[`${unit.id}/${s.id}`]).length
    const next = unit.sections.find(s => !p[`${unit.id}/${s.id}`])
    if (next) return { unit, section: next, done, total: unit.sections.length, started: done > 0 }
  }
  const last = Object.values(UNITS).pop()
  return { unit: last, section: null, done: last.sections.length, total: last.sections.length, started: true }
}
