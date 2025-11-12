import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../utils/api'
import './Dashboard.css'

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/UserProfileScreen', label: '👤 Profil', desc: 'Moje dane' },
    { path: '/zlecenia', label: '🧾 Zlecenia' },
    { path: '/pojazdy', label: '🚗 Pojazdy' },
    { path: '/klienci', label: '👥 Klienci' },
    { path: '/kalendarz', label: '📅 Kalendarz' },
    { path: '/magazyn', label: '📦 Magazyn' },
    { path: '/faktury', label: '🧾 Faktury' },
    { path: '/wiadomosci', label: '💬 Wiadomości' },
    { path: '/ai', label: '🤖 AI' },
    { path: '/search', label: '🔍 Szukaj' },
    { path: '/settings', label: '⚙️ Ustawienia' },
    { path: '/admin/uzytkownicy', label: '👑 Admin' },
  ]

  const upcomingAppointment = {
    vehicle: 'Toyota Corolla 2016',
    service: 'Przegląd + wymiana oleju',
    date: '2025-11-20 10:30',
    mechanic: 'Jan Kowalski',
    status: 'Potwierdzona',
  }

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>🔧 AutoRepair</h1>
        <button onClick={handleLogout} disabled={loading} className="btn-logout">
          {loading ? 'Wylogowywanie...' : 'Wyloguj'}
        </button>
      </header>

      <div className="top-menu-bar">
        {menuItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className="top-menu-card"
          >
            <div className="menu-icon">{item.label.split(' ')[0]}</div>
            <div className="top-menu-label">{item.label.split(' ').slice(1).join(' ')}</div>
          </button>
        ))}
      </div>

      <main className="dashboard-main">
        <section className="welcome-section">
          <h2>Witaj w systemie!</h2>
          <p>Zarządzaj swoimi naprawami i serwisami</p>
        </section>

        <div className="content-area">
          <div className="appointment-card">
            <div className="appointment-header">
              <h3>Następna wizyta</h3>
              <span className="status">{upcomingAppointment.status}</span>
            </div>

            <div className="appointment-body">
              <p><strong>Pojazd:</strong> {upcomingAppointment.vehicle}</p>
              <p><strong>Usługa:</strong> {upcomingAppointment.service}</p>
              <p><strong>Data:</strong> {upcomingAppointment.date}</p>
              <p><strong>Mechanik:</strong> {upcomingAppointment.mechanic}</p>
            </div>

            <div className="appointment-actions">
              <button className="btn-primary" onClick={() => navigate('/kalendarz')}>Umów nową wizytę</button>
              <button className="btn-secondary" onClick={() => navigate('/zlecenia')}>Szczegóły</button>
            </div>
          </div>

          <div className="spacer-card">
            <h3>Twoje zadania</h3>
            <p>Brak aktywnych zadań. Możesz umówić nową wizytę lub sprawdzić historię.</p>
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>© 2025 AutoRepair</p>
      </footer>
    </div>
  )
}

export default Dashboard
