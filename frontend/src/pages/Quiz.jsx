import { useState, useEffect, useCallback, useRef } from 'react'
import { api } from '../api.js'
import { useBadgeToastQueue } from '../utils/useBadgeToastQueue.js'
import BadgeToast from '../components/BadgeToast.jsx'

export default function Quiz({ user, onXpChange }) {
  const [radicals, setRadicals] = useState([])
  const [current, setCurrent] = useState(null)
  const [options, setOptions] = useState([])
  const [answered, setAnswered] = useState(null)
  const [feedback, setFeedback] = useState('')
  const { current: currentToast, pushUnlocked, dismissCurrent } = useBadgeToastQueue()

  // Tracks the current 10-question batch for the "Perfectionist" achievement
  // (100% on 10 quizzes) — this app has no fixed-length quiz sessions, so a
  // "quiz" is defined here as every 10 questions answered.
  const batchRef = useRef({ answered: 0, correct: 0 })

  useEffect(() => {
    api.getRadicals().then(setRadicals)
  }, [])

  const newQuestion = useCallback(() => {
    if (radicals.length < 4) return
    const correct = radicals[Math.floor(Math.random() * radicals.length)]
    const wrongPool = radicals.filter(r => r.meaning !== correct.meaning)
      .sort(() => 0.5 - Math.random()).slice(0, 3)
    const opts = [correct, ...wrongPool].sort(() => 0.5 - Math.random())
    setCurrent(correct)
    setOptions(opts)
    setAnswered(null)
    setFeedback('')
  }, [radicals])

  useEffect(() => {
    if (radicals.length >= 4) newQuestion()
  }, [radicals])

  const choose = async (opt) => {
    if (answered) return
    setAnswered(opt.id)
    const isCorrect = opt.meaning === current.meaning

    if (isCorrect) {
      setFeedback('Correct! +10 xp')
      if (user) {
        try {
          const updated = await api.addXp(user.username, 10)
          onXpChange(updated)
          localStorage.setItem('mandalink_user', JSON.stringify(updated))
        } catch {}
      }
    } else {
      setFeedback(`Not quite — the answer was ${current.meaning}.`)
    }

    // New, separate achievement tracking — doesn't touch XP at all.
    if (user) {
      api.recordAnswer(current.id, isCorrect).then(res => pushUnlocked(res.newlyUnlocked))

      const batch = batchRef.current
      batch.answered += 1
      if (isCorrect) batch.correct += 1
      if (batch.answered >= 10) {
        api.recordQuizComplete(batch.correct, batch.answered).then(res => pushUnlocked(res.newlyUnlocked))
        batchRef.current = { answered: 0, correct: 0 }
      }
    }

    setTimeout(newQuestion, 1100)
  }

  if (!current) {
    return (
      <div className="page">
        <h2 className="page-h">Guess the meaning</h2>
        <p className="helper">Loading...</p>
      </div>
    )
  }

  return (
    <div className="page">
      <h2 className="page-h">Guess the meaning</h2>
      <p className="helper">Pick the correct meaning for the radical shown.</p>
      <div className="quiz-q"><div className="quiz-char">{current.character}</div></div>
      <div className="quiz-opts">
        {options.map(o => (
          <div
            key={o.id}
            className={`quiz-opt ${answered && o.meaning === current.meaning ? 'correct' : ''} ${answered === o.id && o.meaning !== current.meaning ? 'wrong' : ''}`}
            onClick={() => choose(o)}
          >
            {o.meaning}
          </div>
        ))}
      </div>
      <div className="quiz-feedback">{feedback}</div>
      <BadgeToast badge={currentToast} onDone={dismissCurrent} />
    </div>
  )
}
