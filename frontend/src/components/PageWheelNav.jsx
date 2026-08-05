import { useNavigate, useLocation } from 'react-router-dom'
import { useMemo } from 'react'
import OptionWheel from './OptionWheel/OptionWheel.jsx'
import './PageWheelNav.css'

const PAGES = [
  { path: '/radicals', label: 'Radicals' },
  { path: '/flashcards', label: 'Flashcards' },
  { path: '/quiz', label: 'Quiz' },
  { path: '/timed', label: 'Timed mode' },
  { path: '/leaderboard', label: 'Leaderboard' },
  { path: '/stroke', label: 'Stroke order' },
  { path: '/ai', label: 'AI help' }
]

export default function PageWheelNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const defaultSelected = useMemo(() => {
    const idx = PAGES.findIndex(p => p.path === location.pathname)
    return idx === -1 ? 0 : idx
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="page-wheel-nav">
      <OptionWheel
        items={PAGES.map(p => p.label)}
        defaultSelected={defaultSelected}
        textColor="#a6a6a6"
        activeColor="#f0d99a"
        side="left"
        fontSize={1.3}
        spacing={1.6}
        curve={1}
        tilt={6}
        blur={2}
        fade={0.25}
        smoothing={200}
        inset={24}
        loop={false}
        draggable
        soundUrl="/sounds/click-soft.mp3"
        soundVolume={0.5}
        onChange={(index) => navigate(PAGES[index].path)}
      />
    </div>
  )
}
