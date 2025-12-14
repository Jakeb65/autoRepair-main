import React, { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '../../utils/api'
import './Dashboard.css'

type KpiTone = 'ok' | 'warn' | 'bad'

type KPI = {
  title: string
  value: string
  hint: string
  tone?: KpiTone
  onClick?: () => void
}

type ActivityItem = {
  id: string
  ts: string
  text: string
  kind: 'order' | 'stock' | 'invoice' | 'calendar' | 'message'
  onClick?: () => void
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    setLoading(true)
    await logout()
    navigate('/login')
  }

  const menuItems = [
    { path: '/UserProfileScreen', label: '👤 Profil' },
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

  // MOCK — później podepniemy pod API
  const kpis: KPI[] = useMemo(
    () => [
      { title: 'Zlecenia dziś', value: '6', hint: '+2 vs wczoraj', tone: 'ok', onClick: () => navigate('/zlecenia') },
      { title: 'W trakcie', value: '3', hint: '2 na podnośniku', tone: 'warn', onClick: () => navigate('/zlecenia') },
      { title: 'Braki magazynowe', value: '2', hint: 'Filtr oleju, klocki', tone: 'bad', onClick: () => navigate('/magazyn') },
      { title: 'Faktury oczekujące', value: '4', hint: '1 przeterminowana', tone: 'warn', onClick: () => navigate('/faktury') },
    ],
    [navigate]
  )

  const activity: ActivityItem[] = useMemo(
    () => [
      { id: 'a1', ts: '5 min temu', kind: 'order', text: 'Zlecenie #128 → status: w_trakcie', onClick: () => navigate('/zlecenia') },
      { id: 'a2', ts: '18 min temu', kind: 'stock', text: 'Magazyn: filtr oleju poniżej minimum', onClick: () => navigate('/magazyn') },
      { id: 'a3', ts: '35 min temu', kind: 'invoice', text: 'Faktura FV/2025/112 wystawiona', onClick: () => navigate('/faktury') },
      { id: 'a4', ts: '1 godz. temu', kind: 'calendar', text: 'Wizyta dodana: Diagnostyka (Dziś 13:00)', onClick: () => navigate('/kalendarz') },
      { id: 'a5', ts: '2 godz. temu', kind: 'message', text: 'Nowa wiadomość od klienta: Jan Kowalski', onClick: () => navigate('/wiadomosci') },
    ],
    [navigate]
  )

  const toneClass = (tone?: KpiTone) => {
    if (tone === 'ok') return 'kpi ok'
    if (tone === 'warn') return 'kpi warn'
    if (tone === 'bad') return 'kpi bad'
    return 'kpi'
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
          <button key={item.path} onClick={() => navigate(item.path)} className="top-menu-card">
            <div className="menu-icon">{item.label.split(' ')[0]}</div>
            <div className="top-menu-label">{item.label.split(' ').slice(1).join(' ')}</div>
          </button>
        ))}
      </div>

      <main className="dashboard-main">
        <section className="welcome-section">
          <h2>Witaj w systemie!</h2>
          <p>Twój panel dnia: zlecenia, wizyty, alerty i aktywność.</p>
        </section>

        {/* KPI */}
        <section className="kpi-grid">
          {kpis.map((k) => (
            <button key={k.title} className={toneClass(k.tone)} onClick={k.onClick}>
              <div className="kpi-title">{k.title}</div>
              <div className="kpi-value">{k.value}</div>
              <div className="kpi-hint">{k.hint}</div>
            </button>
          ))}
        </section>

        {/* DÓŁ — lepiej ułożony niż 2 karty */}
        <section className="dashboard-grid">
          {/* Następna wizyta (zostawiamy, ale bardziej “panelowo”) */}
          <div className="panel panel-wide">
            <div className="panel-header">
              <h3>Następna wizyta</h3>
              <span className="status">{upcomingAppointment.status}</span>
            </div>

            <div className="appointment-body">
              <p><strong>Pojazd:</strong> {upcomingAppointment.vehicle}</p>
              <p><strong>Usługa:</strong> {upcomingAppointment.service}</p>
              <p><strong>Data:</strong> {upcomingAppointment.date}</p>
              <p><strong>Mechanik:</strong> {upcomingAppointment.mechanic}</p>
            </div>

            <div className="panel-actions">
              <button className="btn-primary" onClick={() => navigate('/kalendarz')}>Umów nową wizytę</button>
              <button className="btn-secondary" onClick={() => navigate('/zlecenia')}>Szczegóły</button>
            </div>

            {/* Szybkie akcje (mini) */}
            <div className="quick-actions">
              <button className="btn-secondary" onClick={() => navigate('/search')}>🔍 Szybkie wyszukiwanie</button>
              <button className="btn-secondary" onClick={() => navigate('/wiadomosci')}>💬 Wiadomości</button>
              <button className="btn-secondary" onClick={() => navigate('/magazyn')}>📦 Magazyn</button>
            </div>
          </div>

          {/* Aktywność + alerty */}
          <div className="panel">
            <div className="panel-header">
              <h3>Ostatnia aktywność</h3>
              <button className="btn-secondary" onClick={() => navigate('/wiadomosci')}>Wiadomości</button>
            </div>

            <div className="feed">
              {activity.map((a) => (
                <button key={a.id} className="feed-item" onClick={a.onClick}>
                  <span className={`dot ${a.kind}`} />
                  <div className="feed-main">
                    <div className="feed-text">{a.text}</div>
                    <div className="feed-ts">{a.ts}</div>
                  </div>
                </button>
              ))}
            </div>

            <div className="panel-actions">
              <button className="btn-secondary" onClick={() => navigate('/magazyn')}>Sprawdź magazyn</button>
              <button className="btn-secondary" onClick={() => navigate('/faktury')}>Faktury</button>
            </div>

            <div className="alert-box">
              <div className="alert-title">⚠️ Alerty</div>
              <ul className="alert-list">
                <li>Braki w magazynie: filtr oleju</li>
                <li>1 faktura przeterminowana</li>
                <li>2 wizyty do potwierdzenia</li>
              </ul>
            </div>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>© 2025 AutoRepair</p>
      </footer>
    </div>
  )
}

export default Dashboard
