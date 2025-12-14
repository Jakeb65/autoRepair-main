import { run } from "./db.js";

export async function initDb() {
  // ważne w SQLite: włącz FK
  await run(`PRAGMA foreign_keys = ON;`);

  // users
  await run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      imie TEXT NOT NULL,
      nazwisko TEXT NOT NULL,
      mail TEXT NOT NULL UNIQUE,
      telefon TEXT,
      rola TEXT NOT NULL DEFAULT 'user',
      haslo TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  // orders
  await run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nazwa TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'nowe',
      opis TEXT,
      uzytkownik_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      FOREIGN KEY (uzytkownik_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // indeksy (wydajność)
  await run(`CREATE INDEX IF NOT EXISTS idx_users_mail ON users(mail);`);
  await run(`CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(uzytkownik_id);`);
}
