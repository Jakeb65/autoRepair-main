import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

const ClientDashboard: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    { path: "/profile", label: "👤 Profil" },
    { path: "/moje-wizyty", label: "📅 Wizyty" },
    { path: "/pojazdy", label: "🚗 Pojazdy" },
    { path: "/wiadomosci", label: "💬 Wiadomości" },
    { path: "/faktury", label: "🧾 Faktury" },
    { path: "/settings", label: "⚙️ Ustawienia" },
  ];

  const currentOrder = {
    service: "Wymiana oleju + filtr",
    status: "W trakcie",
    progress: 60,
    vehicle: "Toyota Corolla 2016",
  };

  const visits = [
    {
      id: 1,
      date: "Dziś 10:30",
      service: "Wymiana oleju + filtr",
      status: "W trakcie",
    },
    {
      id: 2,
      date: "20.11.2025 09:00",
      service: "Diagnostyka",
      status: "Zaplanowana",
    },
  ];

  const vehicles = [
    { id: 1, name: "Toyota Corolla 2016", last: "2025-11-01" },
    { id: 2, name: "VW Golf 2014", last: "2024-08-12" },
  ];

  return (
    <div className="dashboard-container">
      {/* ===== HEADER ===== */}
      <header className="dashboard-header">
        <h1>🔧 AutoRepair</h1>
        <button className="btn-secondary" onClick={() => navigate("/login")}>
          Wyloguj
        </button>
      </header>

      {/* ===== TOP MENU ===== */}
      <div className="top-menu-bar">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className="top-menu-card"
            onClick={() => navigate(item.path)}
          >
            <div className="menu-icon">{item.label.split(" ")[0]}</div>
            <div className="top-menu-label">
              {item.label.split(" ").slice(1).join(" ")}
            </div>
          </button>
        ))}
      </div>

      {/* ===== MAIN ===== */}
      <main className="dashboard-main">
        {/* STATUS */}
        <section className="panel panel-wide">
          <h2>Aktualna naprawa</h2>
          <p><strong>{currentOrder.vehicle}</strong></p>
          <p>{currentOrder.service}</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${currentOrder.progress}%` }}
            />
          </div>
          <p className="status-text">Status: {currentOrder.status}</p>
        </section>

        {/* VISITS + VEHICLES */}
        <section className="dashboard-grid">
          <div className="panel">
            <h3>Najbliższe wizyty</h3>
            {visits.map((v) => (
              <div key={v.id} className="simple-row">
                <div>
                  <strong>{v.service}</strong>
                  <div className="muted">{v.date}</div>
                </div>
                <span className="badge ok">{v.status}</span>
              </div>
            ))}
            <button className="btn-primary" onClick={() => navigate("/kalendarz")}>
              Umów nową wizytę
            </button>
          </div>

          <div className="panel">
            <h3>Moje pojazdy</h3>
            {vehicles.map((v) => (
              <div key={v.id} className="simple-row">
                <div>
                  <strong>{v.name}</strong>
                  <div className="muted">Ostatni serwis: {v.last}</div>
                </div>
                <button className="btn-secondary">Historia</button>
              </div>
            ))}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section className="panel">
          <h3>Szybkie akcje</h3>
          <div className="quick-actions">
            <button className="btn-primary" onClick={() => navigate("/kalendarz")}>
              ➕ Umów wizytę
            </button>
            <button className="btn-secondary" onClick={() => navigate("/wiadomosci")}>
              💬 Napisz do serwisu
            </button>
            <button className="btn-secondary" onClick={() => navigate("/faktury")}>
              🧾 Faktury
            </button>
          </div>
        </section>
      </main>

      <footer className="dashboard-footer">
        © 2025 AutoRepair
      </footer>
    </div>
  );
};

export default ClientDashboard;
