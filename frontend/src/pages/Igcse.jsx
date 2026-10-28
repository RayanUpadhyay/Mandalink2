import { Link } from 'react-router-dom'
import { useTrack } from '../utils/track.js'
import './Ib.css'

// Placeholder until the IGCSE course is built (Phase 4).
export default function Igcse() {
  const [track, setTrack] = useTrack()
  return (
    <div className="page ib-page">
      <div className="ib-hero card">
        <div className="ib-hero-tag">IGCSE Chinese</div>
        <h2 className="page-h">IGCSE 中文</h2>
        <p className="helper">
          The IGCSE course is being built. It will follow the same pattern as the IB course: themed units with reading,
          listening, writing and new characters broken down into radicals.
        </p>
        <p className="helper">
          Until it launches, the radical tools are the best preparation, since every character in the exam is built
          from them. The IB Unit 1 reading texts are also open to everyone if you want exam-style practice now.
        </p>
        <div className="igcse-actions">
          <Link to="/radicals" className="btn primary">Practise radicals</Link>
          <Link to="/ib/u1" className="btn">Try IB Unit 1</Link>
        </div>
        {track === 'igcse'
          ? <p className="ib-track-on">IGCSE is your study track, so it will appear here first as soon as it's ready.</p>
          : <button className="btn ib-track-btn" onClick={() => setTrack('igcse')}>Make IGCSE my study track</button>}
      </div>
    </div>
  )
}
