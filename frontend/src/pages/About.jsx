import './About.css'

export default function About() {
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
        <p className="about-text">
          Have a question, found a bug, or just want to say hi? Reach out at{' '}
          <a href="mailto:mandalinksupport@gmail.com" className="about-link">
            mandalinksupport@gmail.com
          </a>.
        </p>
      </div>
    </div>
  )
}
