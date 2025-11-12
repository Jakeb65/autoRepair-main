import React, { useMemo, useState } from 'react'
import './Kalendarz.css'
import { visits, vehicles, customers } from '../../utils/mockData'

function toISODate(d: Date) {
  return d.toISOString().slice(0, 10)
}

export default function Kalendarz() {
  const [selected, setSelected] = useState<string>(toISODate(new Date()))

  const days = useMemo(() => {
    const base = new Date()
    base.setHours(0, 0, 0, 0)
    const arr: Date[] = []
    for (let i = -3; i <= 10; i++) {
      const d = new Date(base)
      d.setDate(base.getDate() + i)
      arr.push(d)
    }
    return arr
  }, [])

  const dayVisits = useMemo(() => {
    return visits
      .filter(v => v.date.slice(0, 10) === selected)
      .sort((a, b) => a.date.localeCompare(b.date))
  }, [selected])

  return (
    <div className="kalendarz-container">
      <div className="kalendarz-header">
        <h1>Kalendarz</h1>
        <div className="k-actions">
          <button className="k-btn-primary">Umów wizytę</button>
        </div>
      </div>

      <div className="calendar-strip">
        {days.map(d => {
          const dayISO = toISODate(d)
          const isActive = dayISO === selected
          const label = d.toLocaleDateString(undefined, {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit'
          })
          return (
            <button
              key={dayISO}
              className={`day-chip ${isActive ? 'active' : ''}`}
              onClick={() => setSelected(dayISO)}
            >
              {label}
            </button>
          )
        })}
      </div>

      <div className="kalendarz-grid">
        {dayVisits.length === 0 ? (
          <div className="empty-card">
            Brak wizyt w tym dniu. Kliknij „Umów wizytę”, aby dodać nową.
          </div>
        ) : (
          dayVisits.map(v => {
            const veh = vehicles.find(x => x.id === v.vehicleId)
            const cust = customers.find(x => x.id === v.customerId)
            return (
              <div key={v.id} className="visit-card">
                <div className="visit-top">
                  <div className="time">
                    {new Date(v.date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                  <div className="title">{v.title}</div>
                </div>

                <div className="meta">
                  <b>Pojazd:</b>{' '}
                  {veh
                    ? `${veh.make} ${veh.model} ${veh.year} — ${veh.plate}`
                    : '—'}
                </div>
                <div className="meta">
                  <b>Klient:</b> {cust?.name ?? '—'}
                </div>

                <div className="card-actions">
                  <button className="btn-secondary">Szczegóły</button>
                  <button className="btn-secondary">Przełóż</button>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
