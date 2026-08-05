import { useState, useEffect, useRef } from 'react'
import HanziWriter from 'hanzi-writer'
import { api } from '../api.js'
import './Stroke.css'

export default function Stroke() {
  const [radicals, setRadicals] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('demo')
  const [quizMessage, setQuizMessage] = useState('')
  const targetRef = useRef(null)
  const writerRef = useRef(null)

  useEffect(() => {
    api.getRadicals().then(data => {
      setRadicals(data)
      if (data.length > 0) setSelected(data[0])
    })
  }, [])

  useEffect(() => {
    if (!selected || !targetRef.current) return
    targetRef.current.innerHTML = ''
    setQuizMessage('')

    const writer = HanziWriter.create(targetRef.current, selected.character, {
      width: 220,
      height: 220,
      padding: 12,
      strokeColor: '#f0d99a',
      radicalColor: '#e8203f',
      outlineColor: 'rgba(212,169,78,0.25)',
      drawingWidth: 24,
      showOutline: true,
      showCharacter: mode === 'practice' ? false : true
    })
    writerRef.current = writer

    if (mode === 'demo') {
      writer.animateCharacter()
    } else {
      writer.quiz({
        onMistake: () => setQuizMessage('Not quite — try that stroke again.'),
        onCorrectStroke: () => setQuizMessage('Nice — keep going.'),
        onComplete: () => setQuizMessage('Great job! Character complete.')
      })
    }

    return () => {
      writerRef.current = null
    }
  }, [selected, mode])

  const filtered = query
    ? radicals.filter(r =>
        r.character.includes(query) ||
        r.pinyin.toLowerCase().includes(query.toLowerCase()) ||
        r.meaning.toLowerCase().includes(query.toLowerCase())
      )
    : radicals

  const replay = () => {
    if (mode === 'demo' && writerRef.current) {
      writerRef.current.animateCharacter()
    } else if (mode === 'practice' && selected && targetRef.current) {
      targetRef.current.innerHTML = ''
      const writer = HanziWriter.create(targetRef.current, selected.character, {
        width: 220, height: 220, padding: 12,
        strokeColor: '#f0d99a', radicalColor: '#e8203f',
        outlineColor: 'rgba(212,169,78,0.25)', drawingWidth: 24,
        showOutline: true, showCharacter: false
      })
      writerRef.current = writer
      setQuizMessage('')
      writer.quiz({
        onMistake: () => setQuizMessage('Not quite — try that stroke again.'),
        onCorrectStroke: () => setQuizMessage('Nice — keep going.'),
        onComplete: () => setQuizMessage('Great job! Character complete.')
      })
    }
  }

  return (
    <div className="page">
      <h2 className="page-h">Interactive stroke order</h2>
      <p className="helper">Pick a radical, watch the animated stroke guide, then switch to Practice and trace it yourself.</p>

      <div className="search-bar">
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search radicals..."
        />
      </div>
      <p className="helper" style={{ marginTop: -14 }}>
        {filtered.length} of {radicals.length} radicals — scroll to see more
      </p>

      <div className="stroke-picker">
        {filtered.map(r => (
          <div
            key={r.id}
            className={`stroke-pick ${selected && selected.id === r.id ? 'active' : ''}`}
            onClick={() => setSelected(r)}
          >
            {r.character}
          </div>
        ))}
      </div>

      {selected && (
        <div className="stroke-wrap">
          <div className="stroke-box">
            <div ref={targetRef}></div>
          </div>
          <div>
            <div className="mode-toggle">
              <span className={mode === 'demo' ? 'active' : ''} onClick={() => setMode('demo')}>Demo</span>
              <span className={mode === 'practice' ? 'active' : ''} onClick={() => setMode('practice')}>Practice</span>
            </div>
            <p className="helper" style={{ marginBottom: 14 }}>
              {selected.pinyin} · {selected.meaning}
            </p>
            <p className="helper" style={{ marginBottom: 14 }}>
              {mode === 'demo'
                ? 'Watch the animated stroke-by-stroke guide.'
                : 'Trace each stroke in order. Mistakes are okay — keep going.'}
            </p>
            <button className="btn" onClick={replay}>
              {mode === 'demo' ? '▶ replay animation' : '↻ restart practice'}
            </button>
            {quizMessage && <p className="quiz-msg">{quizMessage}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
