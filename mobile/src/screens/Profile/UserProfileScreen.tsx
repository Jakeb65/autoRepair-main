import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './UserProfile.css'

interface UserData {
  id: string
  imie: string
  nazwisko: string
  email: string
  telefon: string
  pesel: string
  dataUrodzenia: string
  miasto: string
  ulica: string
  numerDomu: string
  kodPocztowy: string
  wojewodztwo: string
  dataZalozenia: string
  statusKonta: 'aktywne' | 'nieaktywne'
  rola: 'klient' | 'mechanik' | 'admin'
  ocena: number
  liczbaRecenzji: number
  avatar: string
  dokumentyZweryfikowane: boolean
}

const UserProfileScreen: React.FC = () => {
  const navigate = useNavigate()
  
  const [userData] = useState<UserData>({
    id: 'USR-001',
    imie: 'Jan',
    nazwisko: 'Kowalski',
    email: 'jan.kowalski@example.com',
    telefon: '+48 123 456 789',
    pesel: '12345678901',
    dataUrodzenia: '1990-05-15',
    miasto: 'Kraków',
    ulica: 'ul. Szeroka',
    numerDomu: '42',
    kodPocztowy: '31-053',
    wojewodztwo: 'Małopolskie',
    dataZalozenia: '2023-06-20',
    statusKonta: 'aktywne',
    rola: 'klient',
    ocena: 4.8,
    liczbaRecenzji: 24,
    avatar: '👤',
    dokumentyZweryfikowane: true
  })

  const handleEditProfile = () => {
    navigate('/edit-profile')
  }

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <button onClick={() => navigate('/home')} className="btn-back">
          ← Wróć
        </button>
        <h1>Mój Profil</h1>
        <div className="header-spacer"></div>
      </header>

      <main className="profile-main">
        <div className="profile-avatar-section">
          <div className="avatar">{userData.avatar}</div>
          <h2>{userData.imie} {userData.nazwisko}</h2>
          <p className="user-id">ID: {userData.id}</p>
          {userData.dokumentyZweryfikowane && (
            <span className="verified-badge">✓ Zweryfikowany</span>
          )}
        </div>

        <div className="profile-rating-section">
          <div className="rating-item">
            <span className="rating-label">Ocena:</span>
            <span className="rating-value">⭐ {userData.ocena}/5</span>
          </div>
          <div className="rating-item">
            <span className="rating-label">Recenzji:</span>
            <span className="rating-value">{userData.liczbaRecenzji}</span>
          </div>
        </div>

        <div className="profile-section">
          <h3>Dane Kontaktowe</h3>
          <div className="info-group">
            <div className="info-item">
              <label>Email:</label>
              <span>{userData.email}</span>
            </div>
            <div className="info-item">
              <label>Telefon:</label>
              <span>{userData.telefon}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Dane Osobowe</h3>
          <div className="info-group">
            <div className="info-item">
              <label>PESEL:</label>
              <span>{userData.pesel}</span>
            </div>
            <div className="info-item">
              <label>Data Urodzenia:</label>
              <span>{new Date(userData.dataUrodzenia).toLocaleDateString('pl-PL')}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Adres Zamieszkania</h3>
          <div className="info-group">
            <div className="info-item">
              <label>Ulica:</label>
              <span>{userData.ulica} {userData.numerDomu}</span>
            </div>
            <div className="info-item">
              <label>Kod Pocztowy:</label>
              <span>{userData.kodPocztowy}</span>
            </div>
            <div className="info-item">
              <label>Miasto:</label>
              <span>{userData.miasto}</span>
            </div>
            <div className="info-item">
              <label>Województwo:</label>
              <span>{userData.wojewodztwo}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h3>Informacje o Koncie</h3>
          <div className="info-group">
            <div className="info-item">
              <label>Status:</label>
              <span className={`status ${userData.statusKonta}`}>
                {userData.statusKonta === 'aktywne' ? '🟢 Aktywne' : '🔴 Nieaktywne'}
              </span>
            </div>
            <div className="info-item">
              <label>Rola:</label>
              <span>{userData.rola === 'klient' ? 'Klient' : userData.rola === 'mechanik' ? 'Mechanik' : 'Administrator'}</span>
            </div>
            <div className="info-item">
              <label>Data Założenia:</label>
              <span>{new Date(userData.dataZalozenia).toLocaleDateString('pl-PL')}</span>
            </div>
          </div>
        </div>

        <div className="profile-actions">
          <button onClick={handleEditProfile} className="btn-primary">
            Edytuj Profil
          </button>
          <button onClick={handleLogout} className="btn-logout">
            Wyloguj się
          </button>
        </div>
      </main>
    </div>
  )
}

export default UserProfileScreen
