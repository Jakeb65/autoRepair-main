import bcrypt from "bcrypt";
import { get, run } from "./db.js";

export async function seedIfNeeded() {
  // czy tabela users istnieje
  const table = await get<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name='users'`
  );
  if (!table) return;

  // czy są jacyś użytkownicy
  const countRow = await get<{ count: number }>(`SELECT COUNT(*) as count FROM users`);
  if (countRow && countRow.count > 0) {
    console.log("ℹ️ Baza już zawiera dane — seed pominięty");
    return;
  }

  console.log("🌱 Pusta baza — wykonuję seed...");

  // USERS
  const users = [
    { imie: "Test", nazwisko: "User", mail: "test@example.com", telefon: "123456789", rola: "user", haslo: "password123" },
    { imie: "Admin", nazwisko: "User", mail: "admin@example.com", telefon: "987654321", rola: "admin", haslo: "admin123" }
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.haslo, 10);
    await run(
      `INSERT INTO users (imie, nazwisko, mail, telefon, rola, haslo) VALUES (?, ?, ?, ?, ?, ?)`,
      [u.imie, u.nazwisko, u.mail, u.telefon, u.rola, hashed]
    );
  }

  // CUSTOMERS
  const cust = await run(
    `INSERT INTO customers (name, email, phone, notes) VALUES (?, ?, ?, ?)`,
    ["Jan Kowalski", "jan.kowalski@example.com", "111222333", "Klient testowy"]
  );
  const customerId = cust.lastID;

  // VEHICLES
  const veh = await run(
    `INSERT INTO vehicles (customer_id, make, model, year, plate, vin) VALUES (?, ?, ?, ?, ?, ?)`,
    [customerId, "Toyota", "Corolla", 2016, "WX 12345", "VINTEST1234567890"]
  );
  const vehicleId = veh.lastID;

  // ORDER (nowy schemat)
  const testUser = await get<{ id: number }>(`SELECT id FROM users WHERE mail = ?`, ["test@example.com"]);
  const createdById = testUser?.id ?? null;

  await run(
    `INSERT INTO orders (service, status, opis, customer_id, vehicle_id, mechanic_user_id, created_by_user_id, start_at, end_at)
     VALUES (?, 'nowe', ?, ?, ?, NULL, ?, datetime('now'), NULL)`,
    ["Wymiana olejów", "Wymiana olejów i filtrów", customerId, vehicleId, createdById]
  );

  console.log("✅ Seed zakończony");
}
