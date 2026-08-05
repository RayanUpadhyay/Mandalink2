import { useState } from 'react'
import './Stroke.css'

export default function Stroke() {
  const [mode, setMode] = useState('demo')
  const [playKey, setPlayKey] = useState(0)

  return (
    <div className="page">
      <h2 className="page-h">Interactive stroke order</h2>
      <div className="mode-toggle">
        <span className={mode === 'demo' ? 'active' : ''} onClick={() => setMode('demo')}>Demo</span>
        <span className={mode === 'practice' ? 'active' : ''} onClick={() => setMode('practice')}>Practice</span>
      </div>
      <div className="stroke-wrap">
        <div className="stroke-box">
          <svg viewBox="0 0 100 100" width="140" height="140" key={playKey}>
            <path className="stroke-path p1" d="M20,20 L80,20" />
            <path className="stroke-path p2" d="M50,10 L50,90" />
            <path className="stroke-path p3" d="M20,80 L80,80" />
          </svg>
        </div>
        <div>
          <p className="helper" style={{ marginBottom: 14 }}>
            {mode === 'demo'
              ? 'Watch the animated stroke-by-stroke guide for 王 (wáng), then switch to Practice Mode and trace it yourself.'
              : 'Trace each stroke on the character above in the order shown, then compare to the demo.'}
          </p>
          <button className="btn" onClick={() => setPlayKey(k => k + 1)}>▶ play animation</button>
        </div>
      </div>
    </div>
  )
}
