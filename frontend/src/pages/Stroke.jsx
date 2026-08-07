import { useState, useEffect, useRef, useCallback } from 'react'
import HanziWriter from 'hanzi-writer'
import { api } from '../api.js'
import './Stroke.css'

const DATA_URL = char =>
  `https://cdn.jsdelivr.net/npm/hanzi-writer-data@2.0.1/${encodeURIComponent(char)}.json`

// Some radical entries store compound forms like "長 (镸, 长)" — always use just
// the primary character for rendering, same as the original app did.
const primaryChar = (character) => (character || '').split(' ')[0].trim()

// Custom loader so a missing/unavailable character fails cleanly instead of
// leaving HanziWriter in a broken, partially-rendered state.
function safeCharDataLoader(char, onComplete, onError) {
  fetch(DATA_URL(char))
    .then(res => {
      if (!res.ok) throw new Error('no stroke data')
      return res.json()
    })
    .then(onComplete)
    .catch(() => onError && onError())
}

export default function Stroke() {
  const [radicals, setRadicals] = useState([])
  const [query, setQuery] = useState('')
  const [selected, setSelected] = useState(null)
  const [mode, setMode] = useState('demo')
  const [quizMessage, setQuizMessage] = useState('')
  const [dataUnavailable, setDataUnavailable] = useState(false)
  const targetRef = useRef(null)
  const writerRef = useRef(null)

  useEffect(() => {
    api.getRadicals().then(data => {
      setRadicals(data)
      if (data.length > 0) setSelected(data[0])
    })
  }, [])

  const createWriter = useCallback((character, currentMode) => {
    if (!targetRef.current) return
    const char = primaryChar(character)
    targetRef.current.innerHTML = ''
    setQuizMessage('')
    setDataUnavailable(false)
    writerRef.current = null

    let cancelled = false

    const writer = HanziWriter.create(targetRef.current, char, {
      width: 220,
      height: 220,
      padding: 12,
      strokeColor: '#f0d99a',
      radicalColor: '#e8203f',
      outlineColor: 'rgba(212,169,78,0.25)',
      drawingWidth: 24,
      showOutline: true,
      showCharacter: currentMode === 'practice' ? false : true,
      charDataLoader: (char, onComplete) => {
        safeCharDataLoader(char, (data) => {
          if (cancelled) return
          onComplete(data)
        }, () => {
          if (cancelled) return
          if (targetRef.current) targetRef.current.innerHTML = ''
          setDataUnavailable(true)
        })
      }
    })
    writerRef.current = writer

    if (currentMode === 'demo') {
      writer.animateCharacter()
    } else {
      writer.quiz({
        onMistake: () => setQuizMessage('Not quite — try that stroke again.'),
        onCorrectStroke: () => setQuizMessage('Nice — keep going.'),
        onComplete: () => setQuizMessage('Great job! Character complete.')
      })
    }

    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (!selected) return
    const cancel = createWriter(selected.character, mode)
    return () => {
      if (cancel) cancel()
      writerRef.current = null
    }
  }, [selected, mode, createWriter])

  const filtered = query
    ? radicals.filter(r =>
        r.character.includes(query) ||
        r.pinyin.toLowerCase().includes(query.toLowerCase()) ||
        r.meaning.toLowerCase().includes(query.toLowerCase())
      )
    : radicals

  const replay = () => {
    if (!selected) return
    if (mode === 'demo' && writerRef.current && !dataUnavailable) {
      writerRef.current.animateCharacter()
    } else {
      createWriter(selected.character, mode)
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
            {primaryChar(r.character)}
          </div>
        ))}
      </div>

      {selected && (
        <div className="stroke-wrap">
          <div className="stroke-box">
            {dataUnavailable ? (
              <p className="helper" style={{ textAlign: 'center', margin: 0, padding: '0 16px' }}>
                Stroke data isn't available for this character yet.
              </p>
            ) : (
              <div ref={targetRef}></div>
            )}
          </div>
          <div>
            <div className="mode-toggle">
              <span className={mode === 'demo' ? 'active' : ''} onClick={() => setMode('demo')}>Demo</span>
              <span className={mode === 'practice' ? 'active' : ''} onClick={() => setMode('practice')}>Practice</span>
            </div>
            <p className="helper" style={{ marginBottom: 14 }}>
              {selected.character} · {selected.pinyin} · {selected.meaning}
            </p>
            <p className="helper" style={{ marginBottom: 14 }}>
              {dataUnavailable
                ? 'Try another radical from the list above.'
                : mode === 'demo'
                  ? 'Watch the animated stroke-by-stroke guide.'
                  : 'Trace each stroke in order. Mistakes are okay — keep going.'}
            </p>
            {!dataUnavailable && (
              <button className="btn" onClick={replay}>
                {mode === 'demo' ? '▶ replay animation' : '↻ restart practice'}
              </button>
            )}
            <div style={{ marginTop: 14 }}>
              <a
                href={`http://www.r12345.com/ziyuan/?char=${encodeURIComponent(primaryChar(selected.character))}`}
                target="_blank"
                rel="noopener noreferrer"
                className="etym-link"
              >
                View character origin (字源) →
              </a>
            </div>
            {quizMessage && <p className="quiz-msg">{quizMessage}</p>}
          </div>
        </div>
      )}
    </div>
  )
}
