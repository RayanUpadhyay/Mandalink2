import './About.css'

export default function About() {
  return (
    <div className="page">
      <div className="card about-card">
        <img src="/about-photo.jpg" alt="Rayan Upadhyay" className="about-photo" />
        <p className="about-caption">Rayan Upadhyay, TISB Class of 2027</p>

        <p className="about-text">
          Hello Friends, 大家好! Welcome to <span className="accent">Mandalink</span>.
        </p>
        <p className="about-text">
          I'm Rayan, a high schooler at The International School Bangalore (TISB). My passion
          lies in Computer Science and Linguistics. My Mandarin arc started way back in primary
          school in Shanghai. One day it was "ooh, cool characters," and the next thing I knew…
          ten years later I'm still here, happily collecting new words like they're Pokémon.
        </p>
        <p className="about-text">
          Somewhere along the way, I got obsessed with the crossover of{' '}
          <em>linguistics × technology</em> — because language is fun, tech is fun, and together
          they're kind of unstoppable.
        </p>
        <p className="about-text">
          <span className="accent">Mandalink</span> is my way of making Mandarin feel less like
          climbing a mountain and more like unlocking levels in a game: you learn characters by
          spotting radicals (the little building blocks that keep showing up). I built this web
          app from scratch with help from a few very patient mentors, a lot of trial-and-error,
          and plenty of tinkering with Python, Java, HTML, CSS, JavaScript, and SQL. There's light
          gamification, serious stroke-order practice, and lots of tiny "hey, I can do this!"
          moments.
        </p>
        <p className="about-text">
          Have a question, found a bug, or just want to say hi? Please reach out to me at{' '}
          <a href="mailto:mandalinksupport@gmail.com" className="about-link">
            mandalinksupport@gmail.com
          </a>.
        </p>
      </div>
    </div>
  )
}
