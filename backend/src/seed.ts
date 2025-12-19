import bcrypt from "bcrypt";
import { run, get, all } from "./db.js";
import { initDb } from "./dbInit.js";

type IdRow = { id: number };

async function main() {
  console.log("🌱 Seeding database (5 per table)...");
  await initDb();

  // ===== CLEAR (kolejność ważna przez FK) =====
  await run(`DELETE FROM messages`);
  await run(`DELETE FROM message_threads`);
  await run(`DELETE FROM notifications`);
  await run(`DELETE FROM invoices`);
  await run(`DELETE FROM appointments`);
  await run(`DELETE FROM orders`);
  await run(`DELETE FROM vehicles`);
  await run(`DELETE FROM customers`);
  await run(`DELETE FROM users`);

  // ===== USERS (5) =====
  const users = [
    { imie: "Admin", nazwisko: "Serwis", mail: "admin@example.com", telefon: "500000001", rola: "admin", haslo: "admin123" },
    { imie: "Jan", nazwisko: "Kowalski", mail: "jan@example.com", telefon: "500000002", rola: "user", haslo: "haslo123" },
    { imie: "Ala", nazwisko: "Nowak", mail: "ala@example.com", telefon: "500000003", rola: "user", haslo: "pass123" },
    { imie: "Kamil", nazwisko: "Wójcik", mail: "kamil@example.com", telefon: "500000004", rola: "user", haslo: "pass123" },
    { imie: "Ola", nazwisko: "Zielińska", mail: "ola@example.com", telefon: "500000005", rola: "user", haslo: "pass123" }
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.haslo, 10);
    await run(
      `INSERT INTO users (imie, nazwisko, mail, telefon, rola, haslo)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [u.imie, u.nazwisko, u.mail, u.telefon, u.rola, hashed]
    );
    console.log(`✅ User: ${u.mail} / ${u.haslo}`);
  }

  const admin = await get<IdRow>(`SELECT id FROM users WHERE mail = ?`, ["admin@example.com"]);
  const mechJan = await get<IdRow>(`SELECT id FROM users WHERE mail = ?`, ["jan@example.com"]);
  const mechAla = await get<IdRow>(`SELECT id FROM users WHERE mail = ?`, ["ala@example.com"]);

  // ===== CUSTOMERS (5) =====
  const customers = [
    { name: "Adam Nowak", email: "adam@client.pl", phone: "600700801", notes: "Stały klient" },
    { name: "Marek Wiśniewski", email: "marek@client.pl", phone: "600700802", notes: "Preferuje kontakt SMS" },
    { name: "Katarzyna Lewandowska", email: "kasia@client.pl", phone: "600700803", notes: "Auto flotowe" },
    { name: "Piotr Zieliński", email: "piotr@client.pl", phone: "600700804", notes: "Pilne terminy" },
    { name: "Ewa Kamińska", email: "ewa@client.pl", phone: "600700805", notes: "Nowy klient" }
  ];

  for (const c of customers) {
    await run(
      `INSERT INTO customers (name, email, phone, notes)
       VALUES (?, ?, ?, ?)`,
      [c.name, c.email, c.phone, c.notes]
    );
  }
  console.log("✅ Customers: 5");

  const c1 = await get<IdRow>(`SELECT id FROM customers WHERE name = ?`, ["Adam Nowak"]);
  const c2 = await get<IdRow>(`SELECT id FROM customers WHERE name = ?`, ["Marek Wiśniewski"]);
  const c3 = await get<IdRow>(`SELECT id FROM customers WHERE name = ?`, ["Katarzyna Lewandowska"]);
  const c4 = await get<IdRow>(`SELECT id FROM customers WHERE name = ?`, ["Piotr Zieliński"]);
  const c5 = await get<IdRow>(`SELECT id FROM customers WHERE name = ?`, ["Ewa Kamińska"]);

  // ===== VEHICLES (5) =====
  const vehicles = [
    { customer_id: c1!.id, make: "Toyota", model: "Corolla", year: 2016, plate: "KR1234A", vin: "JTDBR32E111111111" },
    { customer_id: c2!.id, make: "Volkswagen", model: "Golf", year: 2014, plate: "WA9876B", vin: "WVWZZZ1K222222222" },
    { customer_id: c3!.id, make: "Ford", model: "Transit", year: 2019, plate: "GD4567C", vin: "WF0XXXTTG333333333" },
    { customer_id: c4!.id, make: "BMW", model: "3", year: 2018, plate: "PO7654D", vin: "WBA8E9G5444444444" },
    { customer_id: c5!.id, make: "Audi", model: "A4", year: 2017, plate: "LU1122E", vin: "WAUZZZ8K555555555" }
  ];

  for (const v of vehicles) {
    await run(
      `INSERT INTO vehicles (customer_id, make, model, year, plate, vin)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [v.customer_id, v.make, v.model, v.year, v.plate, v.vin]
    );
  }
  console.log("✅ Vehicles: 5");

  const v1 = await get<IdRow>(`SELECT id FROM vehicles WHERE plate = ?`, ["KR1234A"]);
  const v2 = await get<IdRow>(`SELECT id FROM vehicles WHERE plate = ?`, ["WA9876B"]);
  const v3 = await get<IdRow>(`SELECT id FROM vehicles WHERE plate = ?`, ["GD4567C"]);
  const v4 = await get<IdRow>(`SELECT id FROM vehicles WHERE plate = ?`, ["PO7654D"]);
  const v5 = await get<IdRow>(`SELECT id FROM vehicles WHERE plate = ?`, ["LU1122E"]);

  // ===== ORDERS (5) =====
  const orders = [
    { service: "Wymiana oleju i filtrów", status: "w_trakcie", opis: "Pełny serwis olejowy", customer_id: c1!.id, vehicle_id: v1!.id, mechanic_user_id: mechJan!.id, created_by_user_id: admin!.id, start_at: "2025-12-01 09:00", end_at: null },
    { service: "Diagnostyka (check engine)", status: "nowe", opis: "Kontrolka silnika świeci", customer_id: c2!.id, vehicle_id: v2!.id, mechanic_user_id: mechAla!.id, created_by_user_id: admin!.id, start_at: "2025-12-01 11:00", end_at: null },
    { service: "Klocki + tarcze przód", status: "w_trakcie", opis: "Hamowanie piszczy", customer_id: c3!.id, vehicle_id: v3!.id, mechanic_user_id: mechJan!.id, created_by_user_id: admin!.id, start_at: "2025-12-02 09:30", end_at: null },
    { service: "Wymiana akumulatora", status: "zakonczone", opis: "Akumulator padł rano", customer_id: c4!.id, vehicle_id: v4!.id, mechanic_user_id: mechAla!.id, created_by_user_id: admin!.id, start_at: "2025-11-28 10:00", end_at: "2025-11-28 10:45" },
    { service: "Serwis klimatyzacji", status: "nowe", opis: "Słabe chłodzenie", customer_id: c5!.id, vehicle_id: v5!.id, mechanic_user_id: null, created_by_user_id: admin!.id, start_at: null, end_at: null }
  ];

  for (const o of orders) {
    await run(
      `INSERT INTO orders
        (service, status, opis, customer_id, vehicle_id, mechanic_user_id, created_by_user_id, start_at, end_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        o.service,
        o.status,
        o.opis ?? null,
        o.customer_id,
        o.vehicle_id,
        o.mechanic_user_id ?? null,
        o.created_by_user_id ?? null,
        o.start_at ?? null,
        o.end_at ?? null
      ]
    );
  }
  console.log("✅ Orders: 5");

  // pobierz id 5 ostatnich orderów (po delete będą od 1..5, ale robimy bezpiecznie)
  const orderRows = await all<{ id: number; customer_id: number; vehicle_id: number }>(
    `SELECT id, customer_id, vehicle_id FROM orders ORDER BY id ASC LIMIT 5`
  );
  const [o1, o2, o3, o4, o5] = orderRows;

  // ===== APPOINTMENTS (5) =====
  const appointments = [
    { title: "Serwis Toyota Corolla", start_at: "2025-12-01 09:00", end_at: "2025-12-01 10:30", status: "zaplanowana", customer_id: c1!.id, vehicle_id: v1!.id, order_id: o1.id, notes: "Prośba o kontakt po diagnozie" },
    { title: "Diagnostyka VW Golf", start_at: "2025-12-01 11:00", end_at: "2025-12-01 12:00", status: "zaplanowana", customer_id: c2!.id, vehicle_id: v2!.id, order_id: o2.id, notes: "" },
    { title: "Hamulce Ford Transit", start_at: "2025-12-02 09:30", end_at: "2025-12-02 12:00", status: "zaplanowana", customer_id: c3!.id, vehicle_id: v3!.id, order_id: o3.id, notes: "Części przygotować wcześniej" },
    { title: "Wymiana akumulatora BMW", start_at: "2025-11-28 10:00", end_at: "2025-11-28 10:45", status: "zakonczona", customer_id: c4!.id, vehicle_id: v4!.id, order_id: o4.id, notes: "Zakończono bez uwag" },
    { title: "Klimatyzacja Audi A4", start_at: "2025-12-03 13:00", end_at: "2025-12-03 14:00", status: "zaplanowana", customer_id: c5!.id, vehicle_id: v5!.id, order_id: o5.id, notes: "Sprawdzić szczelność" }
  ];

  for (const a of appointments) {
    await run(
      `INSERT INTO appointments (title, start_at, end_at, status, customer_id, vehicle_id, order_id, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [a.title, a.start_at, a.end_at ?? null, a.status, a.customer_id ?? null, a.vehicle_id ?? null, a.order_id ?? null, a.notes ?? null]
    );
  }
  console.log("✅ Appointments: 5");

  // ===== PARTS (5) =====
  await run(
    `INSERT INTO parts (name, sku, brand, stock, min_stock, price, location)
     VALUES
     ('Filtr oleju', 'FO-001', 'Bosch', 5, 2, 39.99, 'Regał A1'),
     ('Olej silnikowy 5W30', 'OIL-5W30-001', 'Castrol', 1, 3, 199.99, 'Magazyn Główny'),
     ('Klocki hamulcowe przód', 'BRK-PAD-F-001', 'ATE', 0, 2, 249.00, 'Regał B2'),
     ('Tarcze hamulcowe przód', 'BRK-DISC-F-001', 'Zimmermann', 2, 2, 399.00, 'Regał B3'),
     ('Akumulator 74Ah', 'BAT-74-001', 'Varta', 3, 1, 499.00, 'Regał C1')`
  );
  console.log("✅ Parts: 5");

  // ===== INVOICES (5) =====
  const invoices = [
    { number: "FV/2025/001", customer_id: c1!.id, order_id: o1.id, issue_date: "2025-12-01", due_date: "2025-12-14", amount: 499.99, status: "oczekuje", pdf_path: null },
    { number: "FV/2025/002", customer_id: c2!.id, order_id: o2.id, issue_date: "2025-12-01", due_date: "2025-12-14", amount: 199.99, status: "oczekuje", pdf_path: null },
    { number: "FV/2025/003", customer_id: c3!.id, order_id: o3.id, issue_date: "2025-12-02", due_date: "2025-12-16", amount: 1299.00, status: "oczekuje", pdf_path: null },
    { number: "FV/2025/004", customer_id: c4!.id, order_id: o4.id, issue_date: "2025-11-28", due_date: "2025-12-05", amount: 650.00, status: "zaplacona", pdf_path: null },
    { number: "FV/2025/005", customer_id: c5!.id, order_id: o5.id, issue_date: "2025-12-03", due_date: "2025-12-17", amount: 349.00, status: "oczekuje", pdf_path: null }
  ];

  for (const i of invoices) {
    await run(
      `INSERT INTO invoices (number, customer_id, order_id, issue_date, due_date, amount, status, pdf_path)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [i.number, i.customer_id, i.order_id ?? null, i.issue_date, i.due_date ?? null, i.amount, i.status, i.pdf_path]
    );
  }
  console.log("✅ Invoices: 5");

  // ===== MESSAGE THREADS (5) =====
  const threads = [
    { title: "Kontakt: Toyota Corolla", customer_id: c1!.id, order_id: o1.id, created_by_user_id: admin!.id },
    { title: "Kontakt: VW Golf", customer_id: c2!.id, order_id: o2.id, created_by_user_id: admin!.id },
    { title: "Kontakt: Ford Transit", customer_id: c3!.id, order_id: o3.id, created_by_user_id: admin!.id },
    { title: "Kontakt: BMW 3", customer_id: c4!.id, order_id: o4.id, created_by_user_id: admin!.id },
    { title: "Kontakt: Audi A4", customer_id: c5!.id, order_id: o5.id, created_by_user_id: admin!.id }
  ];

  for (const t of threads) {
    await run(
      `INSERT INTO message_threads (title, customer_id, order_id, created_by_user_id, updated_at)
       VALUES (?, ?, ?, ?, datetime('now'))`,
      [t.title, t.customer_id ?? null, t.order_id ?? null, t.created_by_user_id ?? null]
    );
  }
  console.log("✅ Threads: 5");

  const threadRows = await all<{ id: number }>(`SELECT id FROM message_threads ORDER BY id ASC LIMIT 5`);

  // ===== MESSAGES (5) =====
  const messages = [
    { thread_id: threadRows[0].id, sender_user_id: mechJan!.id, text: "Dzień dobry, zaczynamy serwis olejowy. Dam znać po sprawdzeniu filtrów." },
    { thread_id: threadRows[1].id, sender_user_id: mechAla!.id, text: "Proszę o informację, kiedy pojawiła się kontrolka check engine." },
    { thread_id: threadRows[2].id, sender_user_id: mechJan!.id, text: "Hamulce do wymiany — klocki i tarcze. Potwierdzam części z magazynu." },
    { thread_id: threadRows[3].id, sender_user_id: mechAla!.id, text: "Akumulator wymieniony, proszę obserwować czy nie ma spadków napięcia." },
    { thread_id: threadRows[4].id, sender_user_id: admin!.id, text: "Klimatyzacja zaplanowana. Proszę przyjechać 10 min wcześniej." }
  ];

  for (const m of messages) {
    await run(
      `INSERT INTO messages (thread_id, sender_user_id, sender_customer_id, text)
       VALUES (?, ?, ?, ?)`,
      [m.thread_id, m.sender_user_id ?? null, null, m.text]
    );
    await run(`UPDATE message_threads SET updated_at = datetime('now') WHERE id = ?`, [m.thread_id]);
  }
  console.log("✅ Messages: 5");

  // ===== NOTIFICATIONS (5) =====
  const notifTargets = await all<{ id: number }>(`SELECT id FROM users ORDER BY id ASC LIMIT 5`);

  const notifications = [
    { user_id: notifTargets[0].id, title: "Panel admin", body: "Masz nowe zgłoszenie od klienta (Toyota Corolla)." },
    { user_id: notifTargets[1].id, title: "Nowe zlecenie", body: "Przypisano Ci zlecenie: Wymiana oleju i filtrów." },
    { user_id: notifTargets[2].id, title: "Diagnostyka", body: "Do wykonania: Diagnostyka (check engine) - VW Golf." },
    { user_id: notifTargets[3].id, title: "Magazyn", body: "Część BRK-PAD-F-001 poniżej minimum (stan 0)." },
    { user_id: notifTargets[4].id, title: "Faktury", body: "Nowa faktura wystawiona: FV/2025/005." }
  ];

  for (const n of notifications) {
    await run(
      `INSERT INTO notifications (user_id, title, body)
       VALUES (?, ?, ?)`,
      [n.user_id, n.title, n.body]
    );
  }
  console.log("✅ Notifications: 5");

  console.log("✨ Database seeded successfully (5 per table)!");
}

main().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
