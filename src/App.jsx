import { useEffect, useRef, useState } from 'react'
import './App.css'
import MatrixRain from './components/MatrixRain'

function App() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="app">
      <MatrixRain />
      <div className={`content ${showContent ? 'visible' : ''}`}>
        <div className="welcome-banner">
          <span className="banner-text">Welcome to ELDK 2026- Woohooo</span>
        </div>
        
        <div className="glitch-wrapper">
          <h1 className="glitch" data-text="ENTER THE MATRIX">
            ENTER THE MATRIX
          </h1>
        </div>
        
        <p className="subtitle">Wake up, Neo...</p>
        
        <div className="description">
          <p className="typing-text">The Matrix has you.</p>
          <p className="typing-text delay-1">Follow the white rabbit.</p>
        </div>

        <div className="button-group">
          <button className="matrix-button red-pill">
            <span className="button-text">Take the Red Pill</span>
            <span className="button-glitch"></span>
          </button>
          
          <button className="matrix-button blue-pill">
            <span className="button-text">Take the Blue Pill</span>
            <span className="button-glitch"></span>
          </button>
        </div>

        <div className="info-grid">
          <div className="info-card">
            <h3>Reality</h3>
            <p>What is real?</p>
          </div>
          <div className="info-card">
            <h3>Choice</h3>
            <p>You have to make a choice</p>
          </div>
          <div className="info-card">
            <h3>Truth</h3>
            <p>The truth is out there</p>
          </div>
        </div>

        <footer className="footer">
          <p>SYSTEM STATUS: ONLINE</p>
          <p className="coordinates">COORDINATES: [37.7749° N, 122.4194° W]</p>
        </footer>
      </div>
    </div>
  )
}

export default App
