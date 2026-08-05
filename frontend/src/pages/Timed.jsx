import { useState, useEffect, useRef, useCallback } from 'react'
import { api } from '../api.js'
import './Timed.css'

export default function Timed({ user, onXpChange }) {
  const [radicals, setRadicals] = useState([])
  const [current, setCurrent] = useState(null)
  const [options, setOptions] = useState([])
  const [timeLeft, setTimeLeft] = useState(60)
  const [score, setScore] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  useEffect(() => {
    api.getRadicals().then(setRadicals)
  }, [])

  const newQuestion = useCallback((pool) => {
    const list = pool || radicals
    if (list.length < 4) return
    const correct = list[Math.floor(Math.random() * list.length)]
    const wrongPool = list.filter(r => r.meaning !== correct.meaning)
      .sort(() => 0.5 - Math.random()).slice(0, 3)
    setCurrent(correct)
    setOptions([correct, ...wrongPool].sort(() => 0.5 - Math.random()))
  }, [radicals])

  const start = () => {
    clearInterval(intervalRef.current)
    setScore(0)
    setTimeLeft(60)
    setRunning(true)
    newQuestion()
    intervalRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          clearInterval(intervalRef.current)
          setRunning(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
  }

  useEffect(() => {
    if (radicals.length >= 4 && !running) start()
    return () => clearInterval(intervalRef.current)
  }, [radicals])

  const choose = async (opt) => {
    if (!running) return
    if (opt.meaning === current.meaning) {
      const newScore = score + 10
      setScore(newScore)
      if (user) {
        try {
          const updated = await api.addXp(user.username, 10)
          onXpChange(updated)
          localStorage.setItem('mandalink_user', JSON.stringify(updated))
        } catch {}
      }
    }
    newQuestion()
  }

  return (
    <div className="page">
      <h2 className="page-h">Timed mode</h2>
      <p className="helper">Answer as many as you can before the clock runs out.</p>
      <div className="timer-row">
        <div className="timer-circle">{timeLeft}</div>
        <div className="score-pill">score · {score}</div>
      </div>
      {running && current ? (
        <>
          <div className="quiz-q"><div className="quiz-char">{current.character}</div></div>
          <div className="quiz-opts">
            {options.map(o => (
              <div key={o.id} className="quiz-opt" onClick={() => choose(o)}>{o.meaning}</div>
            ))}
          </div>
        </>
      ) : (
        <div className="quiz-q"><div className="quiz-char">⏱</div></div>
      )}
      <div style={{ textAlign: 'center', marginTop: 20 }}>
        <button className="btn" onClick={start}>restart</button>
      </div>
    </div>
  )
}
