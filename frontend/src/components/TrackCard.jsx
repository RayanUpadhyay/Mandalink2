import { useState } from 'react'
import { Link } from 'react-router-dom'
import TrackPicker from './TrackPicker.jsx'
import { TRACKS, useTrack } from '../utils/track.js'
import { nextIbStep } from '../ib/progress.js'
import './TrackPicker.css'

// Home card that changes with the study track:
//  - no track yet: "What are you studying for?" with the three choices
//  - IB: continue where you left off in the course
//  - IGCSE: status of the course
//  - general: one quiet line offering the exam courses
export default function TrackCard() {
  const [track] = useTrack()
  const [changing, setChanging] = useState(false)

  if (!track || changing) {
    return (
      <div className="card track-card">
        <h3 className="track-card-h">{track ? 'Change your study track' : 'What are you studying for?'}</h3>
        <p className="helper track-card-sub">
          This decides which course Mandalink shows you first. Every tool stays available whatever you pick, and you
          can change it any time.
        </p>
        <TrackPicker onPicked={() => setChanging(false)} />
        {track && <button className="track-link" onClick={() => setChanging(false)}>Cancel</button>}
      </div>
    )
  }

  const change = <button className="track-link" onClick={() => setChanging(true)}>Change track</button>

  if (track === 'general') {
    return (
      <p className="track-quiet">
        Preparing for IB or IGCSE Chinese? <button className="track-link" onClick={() => setChanging(true)}>Choose an exam track</button>
      </p>
    )
  }

  if (track === 'igcse') {
    return (
      <div className="card track-card track-card-row">
        <span className="track-glyph">{TRACKS.igcse.glyph}</span>
        <div className="track-card-main">
          <h3 className="track-card-h">IGCSE Chinese</h3>
          <p className="helper track-card-sub">The course is being built and will appear here first when it launches. Radicals are the best preparation in the meantime.</p>
        </div>
        <div className="track-card-actions">
          <Link to="/igcse" className="btn primary">See the plan</Link>
          {change}
        </div>
      </div>
    )
  }

  // IB
  const step = nextIbStep()
  const pct = Math.round((step.done / step.total) * 100)
  return (
    <div className="card track-card track-card-row">
      <span className="track-glyph">{TRACKS.ib.glyph}</span>
      <div className="track-card-main">
        <h3 className="track-card-h">
          {step.section ? (step.started ? 'Continue your IB course' : 'Start your IB course') : `Unit ${step.unit.no} complete`}
        </h3>
        <p className="helper track-card-sub">
          Unit {step.unit.no} {step.unit.zh} ({step.unit.en})
          {step.section && <>, next up: <b>{step.section.label}</b> {step.section.labelEn}</>}
          {!step.section && <>. More units are on the way.</>}
        </p>
        <div className="track-progress" role="progressbar" aria-valuenow={step.done} aria-valuemin={0} aria-valuemax={step.total} aria-label="Unit progress">
          <span style={{ width: `${pct}%` }} />
        </div>
        <div className="track-progress-label">{step.done} of {step.total} sections done</div>
      </div>
      <div className="track-card-actions">
        <Link to={step.section ? `/ib/${step.unit.id}/${step.section.id}` : `/ib/${step.unit.id}`} className="btn primary">
          {step.section ? (step.started ? 'Continue' : 'Start') : 'Review unit'}
        </Link>
        {change}
      </div>
    </div>
  )
}
