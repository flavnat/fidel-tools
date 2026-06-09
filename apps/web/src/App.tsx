import React, { useState } from 'react'

function App() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setSubmitted(true)
      setEmail('')
    }
  }

  // Helper custom SVG icons for premium appearance
  const StemmerIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  )

  const TransliteratorIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m5 8 6 6 6-6" />
      <path d="m4 14 6 6 8-8" />
    </svg>
  )

  const StopwordIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
      <line x1="9" x2="15" y1="9" y2="15" />
      <line x1="15" x2="9" y1="9" y2="15" />
    </svg>
  )

  const IndexerIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 22V4c0-.5.2-1 .6-1.4C5 2.2 5.5 2 6 2h12c.5 0 1 .2 1.4.6.4.4.6.9.6 1.4v18l-8-4-8 4z" />
    </svg>
  )

  return (
    <div className="container">
      {/* Background radial blurs */}
      <div className="glow-circle-1"></div>
      <div className="glow-circle-2"></div>

      {/* Main glassmorphism card */}
      <main className="coming-soon-card">
        {/* Brand header */}
        <div className="logo-container">
          <img src="/Fidel.png" alt="Fidel logo" className="logo-image" />
          <h1 className="brand-name">Fidel Tools</h1>
        </div>

        {/* Coming soon badge */}
        <div className="badge">
          <span className="badge-dot"></span>
          Coming Soon
        </div>

        {/* Content title & info */}
        <h2 className="title">Next-Gen Amharic NLP Toolkit</h2>
        <p className="description">
          A modern developer ecosystem for Amharic text preprocessing, featuring library packages, a REST API, and interactive playgrounds.
        </p>

        {/* Feature previews */}
        <div className="features-preview">
          <div className="feature-item">
            <span className="feature-icon"><StemmerIcon /></span>
            <span>Morphological Stemmer</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon"><TransliteratorIcon /></span>
            <span>Sera/Felig Transliterator</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon"><StopwordIcon /></span>
            <span>Stopword Filter</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon"><IndexerIcon /></span>
            <span>Corpus Indexer & TF-IDF</span>
          </div>
        </div>

        {/* Email signup form */}
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
          <p className="success-message">
            ✓ Thanks! We'll notify you as soon as we launch.
          </p>
        )}
      </main>

      <footer className="footer-text">
        &copy; {new Date().getFullYear()} Fidel Tools. Open-source under MIT.
      </footer>
    </div>
  )
}

export default App
