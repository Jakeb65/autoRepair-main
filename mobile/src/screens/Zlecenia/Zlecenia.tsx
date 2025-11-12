import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { orders, vehicles, customers } from '../../utils/mockData'
import type { OrderStatus } from '../../navigation/types'
import StatusBadge from '../../components/StatusBadge'
import './Zlecenia.css'

export default function Zlecenia() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<OrderStatus | 'wszystkie'>('wszystkie')

  const data = useMemo(() => {
    return orders
      .filter(o => (status === 'wszystkie' ? true : o.status === status))
      .filter(o => {
        if (!q) return true
        const v = vehicles.find(v => v.id === o.vehicleId)
        const c = customers.find(c => c.id === o.customerId)
        const hay = `${o.service} ${o.mechanic} ${v?.make} ${v?.model} ${v?.plate} ${c?.name}`.toLowerCase()
        return hay.includes(q.toLowerCase())
      })
      .sort((a, b) => a.startDate.localeCompare(b.startDate))
  }, [q, status])

  return (
    <div className="zlecenia-container">
      <div className="zlecenia-header">
        <h1>Zlecenia</h1>
        <div className="zlecenia-actions">
          <input
            className="z-search"
            placeholder="Szukaj po pojeździe, kliencie, usłudze..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <select
            className="z-select"
            value={status}
            onChange={e => setStatus(e.target.value as any)}
          >
            <option value="wszystkie">Wszystkie statusy</option>
            <option value="oczekujące">Oczekujące</option>
            <option value="w trakcie">W trakcie</option>
            <option value="zakończone">Zakończone</option>
            <option value="anulowane">Anulowane</option>
          </select>
          <button className="z-btn-primary">Dodaj nowe zlecenie</button>
        </div>
      </div>

      <div className="zlecenia-grid">
        {data.map(o => {
          const v = vehicles.find(v => v.id === o.vehicleId)
          const c = customers.find(c => c.id === o.customerId)
          return (
            <div key={o.id} className="order-card">
              <div className="card-top">
                <div className="title">{v ? `${v.make} ${v.model} ${v.year}` : 'Pojazd'}</div>
                <StatusBadge status={o.status} />
              </div>
              <div className="meta"><b>Usługa:</b> {o.service}</div>
              <div className="meta"><b>Mechanik:</b> {o.mechanic}</div>
              <div className="meta"><b>Data:</b> {new Date(o.startDate).toLocaleString()}</div>
              <div className="meta"><b>Klient:</b> {c?.name ?? '—'}</div>
              <div className="card-actions">
                <button className="z-btn-secondary btn-secondary">Szczegóły</button>
                <Link to="/pojazdy" className="btn-link">Pojazd</Link>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
