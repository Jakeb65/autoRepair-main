import React, { useMemo, useState } from 'react'
import './Faktury.css'

type InvoiceStatus = 'opłacona' | 'oczekuje' | 'przeterminowana'
type Invoice = {
  id: string
  number: string
  client: string
  date: string
  amount: number
  status: InvoiceStatus
}

const INVOICES: Invoice[] = [
  { id: 'f1', number: 'FV/11/001', client: 'Jan Kowalski', date: '2025-11-01', amount: 350.5, status: 'opłacona' },
  { id: 'f2', number: 'FV/11/002', client: 'Anna Nowak', date: '2025-11-03', amount: 920.0, status: 'oczekuje' },
  { id: 'f3', number: 'FV/10/045', client: 'ACME Sp. z o.o.', date: '2025-10-22', amount: 1299.99, status: 'przeterminowana' },
  { id: 'f4', number: 'FV/11/003', client: 'Jan Kowalski', date: '2025-11-07', amount: 189.0, status: 'opłacona' },
]

export default function Faktury() {
  const [q, setQ] = useState('')
  const [status, setStatus] = useState<InvoiceStatus | 'wszystkie'>('wszystkie')

  const rows = useMemo(() => {
    const ql = q.toLowerCase()
    return INVOICES
      .filter(r => (status === 'wszystkie' ? true : r.status === status))
      .filter(r => !q ? true : `${r.number} ${r.client}`.toLowerCase().includes(ql))
      .sort((a,b) => b.date.localeCompare(a.date))
  }, [q, status])

  const total = rows.reduce((s, r) => s + r.amount, 0)

  return (
    <div className="faktury-container">
      <div className="faktury-header">
        <h1>Faktury</h1>
        <div className="f-actions">
          <input className="f-search" placeholder="Szukaj po numerze lub kliencie..." value={q} onChange={e => setQ(e.target.value)} />
          <select className="f-select" value={status} onChange={e => setStatus(e.target.value as any)}>
            <option value="wszystkie">Wszystkie</option>
            <option value="opłacona">Opłacone</option>
            <option value="oczekuje">Oczekujące</option>
            <option value="przeterminowana">Przeterminowane</option>
          </select>
          <button className="f-btn-primary">➕ Wystaw fakturę</button>
        </div>
      </div>

      <div className="summary">
        <div className="sum-card">
          <div className="sum-title">Suma w widoku</div>
          <div className="sum-value">{total.toFixed(2)} zł</div>
        </div>
      </div>

      <div className="invoice-table">
        <div className="i-row i-head">
          <div>Numer</div><div>Klient</div><div>Data</div><div>Kwota</div><div>Status</div><div>Akcje</div>
        </div>
        {rows.map(r => (
          <div key={r.id} className="i-row">
            <div>{r.number}</div>
            <div>{r.client}</div>
            <div>{new Date(r.date).toLocaleDateString()}</div>
            <div>{r.amount.toFixed(2)} zł</div>
            <div><span className={`i-status ${r.status}`}>{r.status}</span></div>
            <div className="i-actions">
              <button className="btn-secondary">Podgląd</button>
              <button className="btn-secondary">PDF</button>
              <button className="f-btn-primary ghost">Oznacz</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
