import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from '../../utils/api'
import './Auth.css'

const ResetPasswordScreen: React.FC = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [imie, setImie] = useState('')
  const [nazwisko, setNazwisko] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Prosta walidacja - tylko czy pola nie są puste
    if (!email || !imie || !nazwisko || !newPassword || !confirmPassword) {
      setError('Wszystkie pola są wymagane')
      return
    }

    setLoading(true)
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          mail: email,
          imie,
          nazwisko,
          newPassword
        }),
      })
      const data = await response.json()

      if (data.success) {
        setSuccess('Hasło zostało zmienione pomyślnie!')
        setTimeout(() => navigate('/login'), 2000)
      } else {
        setError(data.error || 'Wystąpił błąd podczas resetowania hasła')
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
        <h2>Reset hasła</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleResetPassword}>
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
            <label htmlFor="newPassword">Nowe hasło:</label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Wpisz nowe hasło"
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
              placeholder="Powtórz nowe hasło"
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Przetwarzanie...' : 'Zmień hasło'}
          </button>
        </form>

        <div className="auth-links">
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="link-button"
          >
            Powrót do logowania
          </button>
          <button
            type="button"
            onClick={() => navigate('/register')}
            className="link-button"
          >
            Nie masz konta? Zarejestruj się
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordScreen
