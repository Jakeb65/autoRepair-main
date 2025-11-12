import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../utils/api'
import './Auth.css'

const RegisterScreen: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [imie, setImie] = useState('')
  const [nazwisko, setNazwisko] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Prosta walidacja - tylko czy pola nie są puste
    if (!email || !imie || !nazwisko || !password || !confirmPassword) {
      setError('Wszystkie pola są wymagane')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: email,
          imie,
          nazwisko,
          password
        }),
      })
      const data = await response.json()

      if (data.success) {
        setSuccess('Rejestracja pomyślna! Możesz się teraz zalogować.')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(data.error || 'Rejestracja nie powiodła się')
      }
    } catch (err) {
      setError('Błąd połączenia')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🔧 AutoRepair</h1>
        <h2>Rejestracja nowego konta</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="email">Adres email:</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Wpisz swój email"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="imie">Imię:</label>
            <input
              id="imie"
              type="text"
              value={imie}
              onChange={(e) => setImie(e.target.value)}
              placeholder="Wpisz swoje imię"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="nazwisko">Nazwisko:</label>
            <input
              id="nazwisko"
              type="text"
              value={nazwisko}
              onChange={(e) => setNazwisko(e.target.value)}
              placeholder="Wpisz swoje nazwisko"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Hasło:</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Wpisz hasło"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Powtórz hasło:</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Powtórz hasło"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Rejestracja w toku...' : 'Zarejestruj się'}
          </button>
        </form>

        <div className="auth-links">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="link-button"
          >
            Masz już konto? Zaloguj się
          </button>
        </div>
      </div>
    </div>
  )
}

export default RegisterScreen
