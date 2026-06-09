import React, { useState, useEffect } from 'react'
import { Globe, Sun, Sparkles } from 'lucide-react'

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  // Target date set to exactly one month from current date: July 9, 2026
  const calculateTimeLeft = () => {
    const difference = +new Date('2026-07-09T00:00:00+03:00') - +new Date()
    let timeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    }

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }
    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
      setEmail('')
    }
  }

  const padZero = (num: number) => String(num).padStart(2, '0')

  return (
    <>
      {/* Background halftone mesh and marble animated smoke blobs */}
      <div className="bg-dots"></div>
      <div className="bg-smoke-1"></div>
      <div className="bg-smoke-2"></div>
      <div className="bg-smoke-3"></div>

      <div className="page-wrapper">
        {/* Floating Top Navigation Header */}
        <header className="nav-header">
          <div className="nav-brand">
            <span className="nav-title">ፊደል</span>
            <div className="badge-group">
              <span className="badge-pill free">Free</span>
              <span className="badge-pill premium">Premium</span>
            </div>
          </div>
          
          <div className="nav-menu">
            <a href="#about" className="nav-link">About</a>
            <a href="#terms" className="nav-link">Terms</a>
            <a href="#submit" className="nav-link">Submit</a>
            <a href="#request" className="nav-link">Request</a>
            
            <div className="nav-actions">
              <button className="icon-btn" aria-label="Language selector">
                <Globe size={16} />
              </button>
              <button className="icon-btn" aria-label="Theme switcher">
                <Sun size={16} />
              </button>
            </div>
          </div>
        </header>

        {/* Central Card */}
        <main className="main-content">
          <section className="coming-soon-card">
            {/* Pill Badge */}
            <div className="card-badge">
              <Sparkles size={12} className="card-badge-icon" />
              <span>11,700+ Users Since Jan 2026</span>
            </div>

            {/* Typography headings */}
            <h1 className="card-title">
              Looking for <em>Premium</em> Ethiopic tools?
            </h1>
            
            <div className="card-subtitle-italic">
              get ready to build and scale on <span className="highlight">fidel.tools</span>
            </div>

            <p className="card-description">
              Masterfully crafted packages for the modern Ethiopic developer. Our premium developer platform is launching soon.
            </p>

            {/* Live Countdown Timer */}
            <div className="countdown-container">
              <div className="countdown-box">
                <span className="countdown-number">{padZero(timeLeft.days)}</span>
                <span className="countdown-label">Days</span>
              </div>
              <div className="countdown-divider">:</div>
              <div className="countdown-box">
                <span className="countdown-number">{padZero(timeLeft.hours)}</span>
                <span className="countdown-label">Hours</span>
              </div>
              <div className="countdown-divider">:</div>
              <div className="countdown-box">
                <span className="countdown-number">{padZero(timeLeft.minutes)}</span>
                <span className="countdown-label">Minutes</span>
              </div>
              <div className="countdown-divider">:</div>
              <div className="countdown-box">
                <span className="countdown-number">{padZero(timeLeft.seconds)}</span>
                <span className="countdown-label">Seconds</span>
              </div>
            </div>

            {/* Email notification form */}
            {!submitted ? (
              <form className="notify-form" onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit" className="submit-btn">
                  Notify Me
                </button>
              </form>
            ) : (
              <div className="success-message">
                ✓ Thanks! We'll notify you as soon as we launch.
              </div>
            )}

            {/* Inner Features Tag List */}
            <div className="card-features">
              <div className="card-feature-item">
                <Sparkles size={12} />
                <span>Multilingual</span>
              </div>
              <div className="card-feature-item">
                <Sparkles size={12} />
                <span>Commercial</span>
              </div>
              <div className="card-feature-item">
                <Sparkles size={12} />
                <span>Support</span>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="page-footer">
          &copy; {new Date().getFullYear()} Fidel Tools. Open-source under MIT.
        </footer>
      </div>
    </>
  )
}

export default App
