import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import Radicals from './pages/Radicals.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Quiz from './pages/Quiz.jsx'
import Timed from './pages/Timed.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Stroke from './pages/Stroke.jsx'
import AiHelp from './pages/AiHelp.jsx'

export default function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('mandalink_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleAuth = (userSummary, token) => {
    setUser(userSummary)
    localStorage.setItem('mandalink_user', JSON.stringify(userSummary))
    localStorage.setItem('mandalink_token', token)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('mandalink_user')
    localStorage.removeItem('mandalink_token')
  }

  return (
    <>
      <Nav user={user} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/auth" element={<Auth onAuth={handleAuth} />} />
        <Route path="/radicals" element={<Radicals />} />
        <Route path="/flashcards" element={<Flashcards />} />
        <Route path="/quiz" element={<Quiz user={user} onXpChange={setUser} />} />
        <Route path="/timed" element={<Timed user={user} onXpChange={setUser} />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/stroke" element={<Stroke />} />
        <Route path="/ai" element={<AiHelp />} />
      </Routes>
    </>
  )
}
