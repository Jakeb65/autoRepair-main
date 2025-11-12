import React, { useMemo, useState } from 'react'
import './Pojazdy.css'
import { vehicles, customers } from '../../utils/mockData'

export default function Pojazdy() {
  const [q, setQ] = useState('')

  const data = useMemo(() => {
    return vehicles.filter(v => {
      if (!q) return true
      const owner = customers.find(c => c.id === v.ownerId)?.name ?? ''
      const hay = `${v.make} ${v.model} ${v.plate} ${owner}`.toLowerCase()
      return hay.includes(q.toLowerCase())
    })
  }, [q])

  return (
    <div className="pojazdy-container">
      <div className="pojazdy-header">
        <h1>Pojazdy</h1>
        <div className="p-actions">
          <input
            className="p-search"
            placeholder="Szukaj po marce, modelu, rejestracji..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button className="p-btn-primary">Dodaj pojazd</button>
        </div>
      </div>

      <div className="pojazdy-grid">
        {data.map(v => {
          const owner = customers.find(c => c.id === v.ownerId)
          return (
            <div key={v.id} className="vehicle-card">
              <div className="vehicle-top">
                <div className="vehicle-title">
                  {v.make} {v.model} <span className="muted">{v.year}</span>
                </div>
                <div className="plate">{v.plate}</div>
              </div>
              <div className="meta"><b>Właściciel:</b> {owner?.name ?? '—'}</div>
              <div className="meta"><b>Ostatnia wizyta:</b> {v.lastServiceAt ? new Date(v.lastServiceAt).toLocaleString() : '—'}</div>
              <div className="card-actions">
                <button className="btn-secondary">Historia</button>
                <button className="btn-secondary">Edytuj</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
