import React, { useMemo, useState } from 'react'
import './AdminUsers.css'

type UserRole = 'admin' | 'kierownik' | 'mechanik' | 'recepcja'
type UserStatus = 'aktywny' | 'zablokowany'

type User = {
  id: string
  name: string
  email: string
  phone?: string
  role: UserRole
  status: UserStatus
  lastLogin?: string
}

const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Adam Administrator', email: 'admin@autorepair.pl', role: 'admin', status: 'aktywny', lastLogin: '2025-11-10T09:15:00' },
  { id: 'u2', name: 'Kinga Kierownik', email: 'kinga@autorepair.pl', role: 'kierownik', status: 'aktywny', lastLogin: '2025-11-11T16:40:00' },
  { id: 'u3', name: 'Marek Mechanik', email: 'marek@autorepair.pl', role: 'mechanik', status: 'aktywny', lastLogin: '2025-11-12T07:55:00' },
  { id: 'u4', name: 'Robert Recepcja', email: 'recepcja@autorepair.pl', role: 'recepcja', status: 'zablokowany', lastLogin: '2025-10-28T12:10:00' },
  { id: 'u5', name: 'Ewa Mechanik', email: 'ewa@autorepair.pl', role: 'mechanik', status: 'aktywny', lastLogin: '2025-11-09T14:05:00' },
]

const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Administrator',
  kierownik: 'Kierownik',
  mechanik: 'Mechanik',
  recepcja: 'Recepcja',
}

export default function AdminUsers() {
  const [q, setQ] = useState('')
  const [role, setRole] = useState<UserRole | 'wszyscy'>('wszyscy')
  const [status, setStatus] = useState<UserStatus | 'wszyscy'>('wszyscy')
  const [users, setUsers] = useState<User[]>(MOCK_USERS)

  const filtered = useMemo(() => {
    const ql = q.trim().toLowerCase()
    return users
      .filter(u => (role === 'wszyscy' ? true : u.role === role))
      .filter(u => (status === 'wszyscy' ? true : u.status === status))
      .filter(u => {
        if (!ql) return true
        return (
          u.name.toLowerCase().includes(ql) ||
          u.email.toLowerCase().includes(ql) ||
          (u.phone ?? '').toLowerCase().includes(ql)
        )
      })
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [q, role, status, users])

  const toggleStatus = (id: string) => {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, status: u.status === 'aktywny' ? 'zablokowany' : 'aktywny' } : u))
    )
  }

  const makeAdmin = (id: string) => {
    setUsers(prev => prev.map(u => (u.id === id ? { ...u, role: 'admin' } : u)))
  }

  const resetPassword = (id: string) => {
    const u = users.find(x => x.id === id)
    alert(`Reset hasła wysłany na adres: ${u?.email}`)
  }

  const addUser = () => {
    const n = prompt('Podaj imię i nazwisko nowego użytkownika:')
    if (!n) return
    const e = prompt('Podaj e-mail:')
    if (!e) return
    setUsers(prev => [
      ...prev,
      {
        id: `u${prev.length + 1}`,
        name: n,
        email: e,
        role: 'recepcja',
        status: 'aktywny',
      },
    ])
  }

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Użytkownicy</h1>
        <div className="a-actions">
          <input
            className="a-search"
            placeholder="Szukaj po imieniu, e-mailu, telefonie…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select className="a-select" value={role} onChange={e => setRole(e.target.value as any)}>
            <option value="wszyscy">Wszystkie role</option>
            <option value="admin">Administrator</option>
            <option value="kierownik">Kierownik</option>
            <option value="mechanik">Mechanik</option>
            <option value="recepcja">Recepcja</option>
          </select>
          <select className="a-select" value={status} onChange={e => setStatus(e.target.value as any)}>
            <option value="wszyscy">Wszystkie statusy</option>
            <option value="aktywny">Aktywny</option>
            <option value="zablokowany">Zablokowany</option>
          </select>
          <button className="a-btn-primary" onClick={addUser}>➕ Dodaj użytkownika</button>
        </div>
      </div>

      <div className="users-grid">
        {filtered.map(u => (
          <div key={u.id} className="user-card">
            <div className="u-top">
              <div className="u-name">{u.name}</div>
              <div className={`u-status ${u.status === 'aktywny' ? 'ok' : 'blocked'}`}>
                {u.status}
              </div>
            </div>

            <div className="u-meta"><b>Rola:</b> <span className={`role-badge role-${u.role}`}>{ROLE_LABEL[u.role]}</span></div>
            <div className="u-meta"><b>E-mail:</b> {u.email}</div>
            {u.phone && <div className="u-meta"><b>Telefon:</b> {u.phone}</div>}
            {u.lastLogin && (
              <div className="u-meta"><b>Ostatnie logowanie:</b> {new Date(u.lastLogin).toLocaleString()}</div>
            )}

            <div className="u-actions">
              <button className="btn-secondary" onClick={() => resetPassword(u.id)}>Reset hasła</button>
              <button className="btn-secondary" onClick={() => makeAdmin(u.id)}>Nadaj admina</button>
              <button className={u.status === 'aktywny' ? 'btn-danger' : 'btn-success'} onClick={() => toggleStatus(u.id)}>
                {u.status === 'aktywny' ? 'Zablokuj' : 'Aktywuj'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
