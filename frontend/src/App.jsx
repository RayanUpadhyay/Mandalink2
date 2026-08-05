import { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Nav from './components/Nav.jsx'
import RequireAuth from './components/RequireAuth.jsx'
import WithWaves from './components/WithWaves.jsx'
import PageWheelNav from './components/PageWheelNav.jsx'
import Home from './pages/Home.jsx'
import Auth from './pages/Auth.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import Radicals from './pages/Radicals.jsx'
import Flashcards from './pages/Flashcards.jsx'
import Quiz from './pages/Quiz.jsx'
import Timed from './pages/Timed.jsx'
import Leaderboard from './pages/Leaderboard.jsx'
import Stroke from './pages/Stroke.jsx'
import AiHelp from './pages/AiHelp.jsx'

const WHEEL_PATHS = ['/radicals', '/flashcards', '/quiz', '/timed', '/leaderboard', '/stroke', '/ai']

export default function App() {
  const [user, setUser] = useState(null)
  const location = useLocation()
  const showWheel = user && WHEEL_PATHS.includes(location.pathname)

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
      {showWheel && <PageWheelNav />}
      <div className={showWheel ? 'app-content with-wheel' : 'app-content'}>
        <Routes>
          <Route path="/" element={<Home user={user} />} />
          <Route path="/auth" element={<WithWaves><Auth onAuth={handleAuth} /></WithWaves>} />
          <Route path="/reset-password" element={<WithWaves><ResetPassword /></WithWaves>} />
          <Route path="/radicals" element={<RequireAuth user={user}><WithWaves><Radicals /></WithWaves></RequireAuth>} />
          <Route path="/flashcards" element={<RequireAuth user={user}><WithWaves><Flashcards /></WithWaves></RequireAuth>} />
          <Route path="/quiz" element={<RequireAuth user={user}><WithWaves><Quiz user={user} onXpChange={setUser} /></WithWaves></RequireAuth>} />
          <Route path="/timed" element={<RequireAuth user={user}><WithWaves><Timed user={user} onXpChange={setUser} /></WithWaves></RequireAuth>} />
          <Route path="/leaderboard" element={<RequireAuth user={user}><WithWaves><Leaderboard /></WithWaves></RequireAuth>} />
          <Route path="/stroke" element={<RequireAuth user={user}><WithWaves><Stroke /></WithWaves></RequireAuth>} />
          <Route path="/ai" element={<RequireAuth user={user}><WithWaves><AiHelp /></WithWaves></RequireAuth>} />
        </Routes>
      </div>
    </>
  )
}
