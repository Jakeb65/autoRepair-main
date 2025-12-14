import bcrypt from "bcrypt";
import { get, run } from "./db.js";

export async function seedIfNeeded() {
  // czy tabela users istnieje
  const table = await get<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='users'`
  );

  if (!table) {
    console.log("🌱 Brak tabel — seed pominięty (dbInit je stworzy)");
    return;
  }

  // czy są jacyś użytkownicy
  const countRow = await get<{ count: number }>(
    `SELECT COUNT(*) as count FROM users`
  );

  if (countRow && countRow.count > 0) {
    console.log("ℹ️ Baza już zawiera dane — seed pominięty");
    return;
  }

  console.log("🌱 Pusta baza — wykonuję seed...");

  // === USERS ===
  const users = [
    {
      imie: "Test",
      nazwisko: "User",
      mail: "test@example.com",
      telefon: "123456789",
      rola: "user",
      haslo: "password123",
    },
    {
      imie: "Admin",
      nazwisko: "User",
      mail: "admin@example.com",
      telefon: "987654321",
      rola: "admin",
      haslo: "admin123",
    },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.haslo, 10);
    await run(
      `INSERT INTO users (imie, nazwisko, mail, telefon, rola, haslo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [u.imie, u.nazwisko, u.mail, u.telefon, u.rola, hashed]
    );
  }

  // === ORDERS ===
  const testUser = await get<{ id: number }>(
    `SELECT id FROM users WHERE mail = ?`,
    ["test@example.com"]
  );

  if (testUser) {
    await run(
      `INSERT INTO orders (nazwa, status, opis, uzytkownik_id)
       VALUES (?, 'nowe', ?, ?)`,
      ["Wymiana olejów", "Wymiana olejów i filtrów", testUser.id]
    );
  }

  console.log("✅ Seed zakończony");
}
