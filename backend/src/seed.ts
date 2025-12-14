import bcrypt from "bcrypt";
import { run, get } from "./db.js";
import { initDb } from "./dbInit.js";

type UserSeed = {
  imie: string;
  nazwisko: string;
  mail: string;
  telefon: string;
  rola: "user" | "admin";
  haslo: string;
};

async function main() {
  console.log("🌱 Seeding database...");

  await initDb();

  // Clear existing data (kolejność ważna przez FK)
  await run(`DELETE FROM orders`);
  await run(`DELETE FROM users`);

  const users: UserSeed[] = [
    { imie: "Test", nazwisko: "User", mail: "test@example.com", telefon: "123456789", rola: "user", haslo: "password123" },
    { imie: "Admin", nazwisko: "User", mail: "admin@example.com", telefon: "987654321", rola: "admin", haslo: "admin123" },
    { imie: "Jan", nazwisko: "Kowalski", mail: "jan@example.com", telefon: "111222333", rola: "user", haslo: "haslo123" }
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.haslo, 10);

    await run(
      `INSERT INTO users (imie, nazwisko, mail, telefon, rola, haslo) VALUES (?, ?, ?, ?, ?, ?)`,
      [u.imie, u.nazwisko, u.mail, u.telefon, u.rola, hashed]
    );

    console.log(`✅ Created user: ${u.mail} (password: ${u.haslo})`);
  }

  const testUser = await get<{ id: number }>(`SELECT id FROM users WHERE mail = ?`, ["test@example.com"]);
  if (testUser) {
    await run(
      `INSERT INTO orders (nazwa, status, opis, uzytkownik_id) VALUES (?, ?, ?, ?)`,
      ["Wymiana olejów", "nowe", "Wymiana olejów i filtrów", testUser.id]
    );
    console.log(`✅ Created order: Wymiana olejów`);
  }

  console.log("✨ Database seeded successfully!");
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
