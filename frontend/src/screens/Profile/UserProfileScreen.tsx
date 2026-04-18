import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './UserProfile.css'
import { getMyProfile, logout, updateMyProfile, type ProfileType } from '../../utils/api'

const isEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())

const UserProfileScreen: React.FC = () => {
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [profile, setProfile] = useState<ProfileType | null>(null)

  const [openEdit, setOpenEdit] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saveOk, setSaveOk] = useState<string | null>(null)

  const [imie, setImie] = useState('')
  const [nazwisko, setNazwisko] = useState('')
  const [mail, setMail] = useState('')
  const [telefon, setTelefon] = useState('')

  const loadProfile = async () => {
    setLoading(true)
    setError(null)
    try {
      const p = await getMyProfile()
      if (!p || typeof p.id !== 'number') {
        setError('Nie udało się pobrać profilu')
        setLoading(false)
        return
      }
      setProfile(p)
      setLoading(false)
    } catch (e: any) {
      setError(e?.message || 'Network error')
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const avatarText = useMemo(() => {
    const a = profile?.imie?.trim()?.[0]?.toUpperCase() || ''
    const b = profile?.nazwisko?.trim()?.[0]?.toUpperCase() || ''
    return (a + b) || '👤'
  }, [profile])

  const roleLabel = useMemo(() => {
    const r = (profile?.rola || '').toLowerCase()
    if (r === 'admin' || r === 'administrator') return 'Administrator'
    if (r === 'mechanik') return 'Mechanik'
    if (r === 'klient') return 'Klient'
    return profile?.rola || 'Użytkownik'
  }, [profile])

  const openEditModal = () => {
    if (!profile) return
    setSaveError(null)
    setSaveOk(null)
    setImie(profile.imie || '')
    setNazwisko(profile.nazwisko || '')
    setMail(profile.mail || '')
    setTelefon(profile.telefon || '')
    setOpenEdit(true)
  }

  const closeEditModal = () => {
    if (saving) return
    setOpenEdit(false)
    setSaveError(null)
  }

  const canSave = useMemo(() => {
    const a = imie.trim()
    const b = nazwisko.trim()
    const c = mail.trim()
    if (!a || !b || !c) return false
    if (!isEmail(c)) return false
    return true
  }, [imie, nazwisko, mail])

  const submitEdit = async () => {
    setSaveError(null)
    setSaveOk(null)

    const a = imie.trim()
    const b = nazwisko.trim()
    const c = mail.trim()
    const d = telefon.trim()

    if (!a) return setSaveError('Uzupełnij pole: Imię')
    if (!b) return setSaveError('Uzupełnij pole: Nazwisko')
    if (!c) return setSaveError('Uzupełnij pole: Email')
    if (!isEmail(c)) return setSaveError('Nieprawidłowy format email')

    setSaving(true)
    const resp = await updateMyProfile({
      imie: a,
      nazwisko: b,
      mail: c,
      telefon: d ? d : '',
    })
    setSaving(false)

    if (!resp.success) {
      setSaveError(resp.message || 'Nie udało się zapisać profilu')
      return
    }

    if (resp.data) {
      setProfile(resp.data)
    } else {
      await loadProfile()
    }

    setSaveOk('Zapisano zmiany')
    setTimeout(() => {
      setOpenEdit(false)
    }, 450)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div className="profile-container">
      <header className="profile-header">
        <button onClick={() => navigate(-1)} className="btn-back">
          ← Wróć
        </button>
        <h1>Mój Profil</h1>
        <div className="header-spacer"></div>
      </header>

      {loading && <div style={{ padding: 12 }}>⏳ Ładowanie…</div>}
      {error && <div style={{ padding: 12, color: '#ffb3b3' }}>⚠️ {error}</div>}

      {!loading && !error && profile && (
        <main className="profile-main">
          <div className="profile-avatar-section">
            <div className="avatar">{avatarText}</div>
            <h2>
              {profile.imie} {profile.nazwisko}
            </h2>
            <p className="user-id">ID: {profile.id}</p>
            <span className="verified-badge">✓ Zalogowany</span>
          </div>

          <div className="profile-section">
            <h3>Dane Kontaktowe</h3>
            <div className="info-group">
              <div className="info-item">
                <label>Email:</label>
                <span>{profile.mail || '—'}</span>
              </div>
              <div className="info-item">
                <label>Telefon:</label>
                <span>{profile.telefon || '—'}</span>
              </div>
            </div>
          </div>

          <div className="profile-section">
            <h3>Informacje o Koncie</h3>
            <div className="info-group">
              <div className="info-item">
                <label>Status:</label>
                <span className="status aktywne">🟢 Aktywne</span>
              </div>
              <div className="info-item">
                <label>Rola:</label>
                <span>{roleLabel}</span>
              </div>
            </div>
          </div>

          <div className="profile-actions">
            <button onClick={openEditModal} className="btn-primary">
              Edytuj Profil
            </button>
            <button onClick={handleLogout} className="btn-logout">
              Wyloguj się
            </button>
          </div>
        </main>
      )}

      {openEdit && (
        <div
          className="profile-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeEditModal()
          }}
        >
          <div className="profile-modal">
            <div className="profile-modal-top">
              <h2 className="profile-modal-title">Edycja profilu</h2>
              <button className="btn-secondary" onClick={closeEditModal} disabled={saving}>
                Zamknij
              </button>
            </div>

            <div className="profile-modal-grid">
              <div className="profile-field">
                <label>Imię</label>
                <input value={imie} onChange={(e) => setImie(e.target.value)} disabled={saving} />
              </div>

              <div className="profile-field">
                <label>Nazwisko</label>
                <input value={nazwisko} onChange={(e) => setNazwisko(e.target.value)} disabled={saving} />
              </div>

              <div className="profile-field" style={{ gridColumn: '1 / -1' }}>
                <label>Email</label>
                <input value={mail} onChange={(e) => setMail(e.target.value)} disabled={saving} />
                {mail.trim() && !isEmail(mail) && <div className="profile-hint profile-hint-error">Nieprawidłowy email</div>}
              </div>

              <div className="profile-field" style={{ gridColumn: '1 / -1' }}>
                <label>Telefon</label>
                <input value={telefon} onChange={(e) => setTelefon(e.target.value)} disabled={saving} />
              </div>
            </div>

            {saveError && <div className="profile-modal-msg error">⚠️ {saveError}</div>}
            {saveOk && <div className="profile-modal-msg ok">✅ {saveOk}</div>}

            <div className="profile-modal-actions">
              <button className="btn-secondary" onClick={closeEditModal} disabled={saving}>
                Anuluj
              </button>
              <button className="btn-primary" onClick={submitEdit} disabled={saving || !canSave}>
                {saving ? 'Zapisywanie…' : 'Zapisz zmiany'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserProfileScreen
