import { TRACKS, useTrack } from '../utils/track.js'
import './TrackPicker.css'

// Three big choices. Used on Home (first visit) and in Profile (to change it).
export default function TrackPicker({ onPicked }) {
  const [track, setTrack] = useTrack()
  const pick = id => { setTrack(id); onPicked && onPicked(id) }
  return (
    <div className="track-options" role="radiogroup" aria-label="Study track">
      {Object.values(TRACKS).map(t => (
        <button
          key={t.id}
          role="radio"
          aria-checked={track === t.id}
          className={`track-option ${track === t.id ? 'on' : ''}`}
          onClick={() => pick(t.id)}
        >
          <span className="track-glyph">{t.glyph}</span>
          <span className="track-text">
            <span className="track-name">{t.name}</span>
            <span className="track-blurb">{t.blurb}</span>
          </span>
        </button>
      ))}
    </div>
  )
}
