import { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import ForgotUsername from './pages/ForgotUsername.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import About from './pages/About.jsx'
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
        <Route path="/forgot-username" element={<ForgotUsername />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/radicals" element={<RequireAuth user={user}><Radicals /></RequireAuth>} />
        <Route path="/flashcards" element={<RequireAuth user={user}><Flashcards /></RequireAuth>} />
        <Route path="/quiz" element={<RequireAuth user={user}><Quiz user={user} onXpChange={setUser} /></RequireAuth>} />
        <Route path="/timed" element={<RequireAuth user={user}><Timed user={user} onXpChange={setUser} /></RequireAuth>} />
        <Route path="/leaderboard" element={<RequireAuth user={user}><Leaderboard /></RequireAuth>} />
        <Route path="/stroke" element={<RequireAuth user={user}><Stroke /></RequireAuth>} />
        <Route path="/ai" element={<RequireAuth user={user}><AiHelp /></RequireAuth>} />
      </Routes>
    </>
  )
}
