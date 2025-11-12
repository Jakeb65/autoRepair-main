import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import './Placeholder.css'

const PlaceholderScreen: React.FC<{ title?: string }> = ({ title }) => {
  const navigate = useNavigate()
  const location = useLocation()
  
  // Generuj tytuł z pathu jeśli nie podano
  const getTitle = () => {
    if (title) return title
    const path = location.pathname
    return path
      .replace(/^\//, '')
      .replace(/-/g, ' ')
      .split('/')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
      .slice(0, -3) || 'Strona'
  }

  return (
    <div className="placeholder-container">
      <header className="placeholder-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Wróć
        </button>
        <h1>{getTitle()}</h1>
      </header>
      <main className="placeholder-main">
        <div className="placeholder-content">
          <div className="placeholder-icon">📄</div>
          <h2>{getTitle()}</h2>
          <p>Ta sekcja będzie dostępna wkrótce. Aplikacja działa bez backendu!</p>
          <button onClick={() => navigate('/home')} className="btn-home">
            Powrót do strony głównej
          </button>
        </div>
      </main>
    </div>
  )
}

export default PlaceholderScreen
