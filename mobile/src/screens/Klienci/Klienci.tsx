import React, { useMemo, useState } from 'react'
import './Klienci.css'
import { customers, vehicles, orders } from '../../utils/mockData'

export default function Klienci() {
  const [q, setQ] = useState('')

  const data = useMemo(() => {
    return customers
      .filter(c =>
        q ? `${c.name} ${c.email} ${c.phone}`.toLowerCase().includes(q.toLowerCase()) : true
      )
      .map(c => {
        const ownedVehicles = vehicles.filter(v => v.ownerId === c.id)
        const customerOrders = orders.filter(o => o.customerId === c.id)
        return { c, ownedVehicles, customerOrders }
      })
  }, [q])

  return (
    <div className="klienci-container">
      <div className="klienci-header">
        <h1>Klienci</h1>
        <div className="k-actions">
          <input
            className="k-search"
            placeholder="Szukaj po nazwisku, e-mailu, telefonie..."
            value={q}
            onChange={e => setQ(e.target.value)}
          />
          <button className="k-btn-primary">Dodaj klienta</button>
        </div>
      </div>

      <div className="klienci-grid">
        {data.map(({ c, ownedVehicles, customerOrders }) => (
          <div key={c.id} className="client-card">
            <div className="client-top">
              <div className="name">{c.name}</div>
              <div className="counts">
                {ownedVehicles.length} pojazd(y) • {customerOrders.length} zleceń
              </div>
            </div>

            <div className="meta"><b>Telefon:</b> {c.phone ?? '—'}</div>
            <div className="meta"><b>Email:</b> {c.email ?? '—'}</div>

            {ownedVehicles.length > 0 && (
              <div className="list">
                <div className="list-title">Pojazdy:</div>
                <ul>
                  {ownedVehicles.map(v => (
                    <li key={v.id}>
                      {v.make} {v.model} {v.year} — {v.plate}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="card-actions">
              <button className="btn-secondary">Karta klienta</button>
              <button className="btn-secondary">Nowe zlecenie</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
