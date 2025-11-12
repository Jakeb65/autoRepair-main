import React, { useMemo, useState } from 'react'
import './Magazyn.css'

type Part = {
  id: string
  name: string
  sku: string
  brand?: string
  stock: number
  minStock: number
  price: number
  location?: string
}

const PARTS: Part[] = [
  { id: 'p1', name: 'Klocki hamulcowe przód', sku: 'KH-PRZ-001', brand: 'Bosch', stock: 8, minStock: 4, price: 149.99, location: 'A1' },
  { id: 'p2', name: 'Tarcze hamulcowe przód', sku: 'TH-PRZ-002', brand: 'ATE', stock: 2, minStock: 4, price: 329.0, location: 'A2' },
  { id: 'p3', name: 'Olej 5W30 1L', sku: 'OL-5W30-1L', brand: 'Castrol', stock: 24, minStock: 12, price: 39.9, location: 'B3' },
  { id: 'p4', name: 'Filtr oleju', sku: 'FO-123', brand: 'Mann', stock: 6, minStock: 6, price: 29.9, location: 'B1' },
  { id: 'p5', name: 'Akumulator 60Ah', sku: 'AKU-60', brand: 'Varta', stock: 1, minStock: 3, price: 399.0, location: 'C2' },
]

export default function Magazyn() {
  const [q, setQ] = useState('')
  const [onlyLow, setOnlyLow] = useState(false)

  const data = useMemo(() => {
    const ql = q.toLowerCase()
    return PARTS
      .filter(p => (onlyLow ? p.stock <= p.minStock : true))
      .filter(p => !q ? true : `${p.name} ${p.sku} ${p.brand ?? ''}`.toLowerCase().includes(ql))
      .sort((a,b) => a.name.localeCompare(b.name))
  }, [q, onlyLow])

  return (
    <div className="magazyn-container">
      <div className="magazyn-header">
        <h1>Magazyn części</h1>
        <div className="m-actions">
          <input className="m-search" placeholder="Szukaj po nazwie / SKU / marce..." value={q} onChange={e => setQ(e.target.value)} />
          <label className="m-toggle">
            <input type="checkbox" checked={onlyLow} onChange={e => setOnlyLow(e.target.checked)} />
            <span>Tylko niskie stany</span>
          </label>
          <button className="m-btn-primary">➕ Dodaj część</button>
        </div>
      </div>

      <div className="parts-grid">
        {data.map(p => {
          const low = p.stock <= p.minStock
          return (
            <div key={p.id} className="part-card">
              <div className="p-top">
                <div className="p-name">{p.name}</div>
                <div className={`p-stock ${low ? 'low' : 'ok'}`}>{p.stock} szt.</div>
              </div>
              <div className="p-meta"><b>SKU:</b> {p.sku}</div>
              <div className="p-meta"><b>Marka:</b> {p.brand ?? '—'}</div>
              <div className="p-meta"><b>Min. stan:</b> {p.minStock}</div>
              <div className="p-meta"><b>Lokalizacja:</b> {p.location ?? '—'}</div>
              <div className="p-meta"><b>Cena:</b> {p.price.toFixed(2)} zł</div>
              <div className="p-actions">
                <button className="btn-secondary">Zarezerwuj</button>
                <button className="btn-secondary">Edytuj</button>
                <button className="m-btn-primary ghost">Zamów</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
