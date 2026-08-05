import { useState } from 'react'
import CurvedInput from '../components/CurvedInput/CurvedInput.jsx'
import { api } from '../api.js'
import './About.css'

export default function About() {
  const [contactMessage, setContactMessage] = useState(null)

  const handleContactSubmit = async (email) => {
    if (!email) return
    setContactMessage(null)
    try {
      const result = await api.contactSupport(email)
      setContactMessage({ type: result.success ? 'success' : 'error', text: result.message })
    } catch (e) {
      setContactMessage({ type: 'error', text: 'Could not reach the server. Try again.' })
    }
  }

  return (
    <div className="page">
      <div className="card about-card">
        <img src="/about-photo.jpg" alt="Rayan Upadhyay" className="about-photo" />
        <h2 className="page-h" style={{ textAlign: 'center' }}>About Me</h2>
        <p className="about-text">
          I'm a Class of 2027 student at TISB, Bangalore and have decided to befriend Computer
          Science for life — especially the AI/ML side of it. My Mandarin arc started way back in
          junior school in Shanghai, where it was my second language. One day it was "ooh, cool
          characters," and the next thing I knew… ten years later I'm still here, happily
          collecting new words like they're Pokémon.
        </p>
        <p className="about-text">
          Somewhere along the way, I got obsessed with the crossover of
          <em> linguistics × technology</em> — because language is fun, tech is fun, and together
          they're kind of unstoppable.
        </p>
        <p className="about-text">
          <strong className="accent">Mandalink</strong> is my way of making Mandarin feel less
          like climbing a mountain and more like unlocking levels in a game: you learn characters
          by spotting radicals (the little building blocks that keep showing up). I built the web
          app from scratch with help from a few very patient mentors, a lot of trial-and-error, and
          plenty of tinkering with Python, Java, React, and other web tools. There's light
          gamification, stroke-order practice, and lots of tiny "hey, I can do this!" moments.
        </p>
      </div>

      <div className="card contact-card">
        <h3 className="contact-h">Get in touch</h3>
        <p className="helper" style={{ marginBottom: 22 }}>
          Have a question or ran into an issue? Send us your email and we'll follow up.
        </p>
        <div className="contact-input-wrap">
          <CurvedInput
            placeholder="you@example.com"
            buttonText="Send"
            theme="light"
            bend={16}
            height={58}
            width={420}
            type="email"
            onSubmit={handleContactSubmit}
          />
        </div>
        {contactMessage && (
          <div className={`auth-msg ${contactMessage.type}`} style={{ marginTop: 16 }}>
            {contactMessage.text}
          </div>
        )}
      </div>
    </div>
  )
}
