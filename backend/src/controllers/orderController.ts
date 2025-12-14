import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.js";
import { all, run, get } from "../db.js";

const allowedStatuses = new Set(["nowe", "w_trakcie", "zakonczone", "anulowane"]);

/* =========================
   LIST ORDERS
   ========================= */
export async function listOrders(req: AuthRequest, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Brak autoryzacji" });
    }

    const isAdmin = req.user.rola === "admin";

    const orders = isAdmin
      ? await all(
          `SELECT
            id,
            service,
            status,
            opis,
            customer_id,
            vehicle_id,
            mechanic_user_id,
            created_by_user_id,
            start_at,
            end_at,
            created_at
           FROM orders
           ORDER BY id DESC`
        )
      : await all(
          `SELECT
            id,
            service,
            status,
            opis,
            customer_id,
            vehicle_id,
            mechanic_user_id,
            created_by_user_id,
            start_at,
            end_at,
            created_at
           FROM orders
           WHERE created_by_user_id = ?
           ORDER BY id DESC`,
          [req.user.id]
        );

    res.json({ success: true, message: "OK", data: orders });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e?.message || "DB error" });
  }
}

/* =========================
   CREATE ORDER
   ========================= */
export async function createOrder(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Brak autoryzacji" });
  }

  const {
    service,
    opis,
    customer_id,
    vehicle_id,
    mechanic_user_id,
    start_at,
    end_at
  } = req.body ?? {};

  if (!service || !customer_id || !vehicle_id) {
    return res.status(400).json({
      success: false,
      message: "Brak pól: service, customer_id, vehicle_id"
    });
  }

  try {
    const result = await run(
      `INSERT INTO orders
        (service, status, opis, customer_id, vehicle_id, mechanic_user_id, created_by_user_id, start_at, end_at)
       VALUES
        (?, 'nowe', ?, ?, ?, ?, ?, ?, ?)`,
      [
        String(service),
        opis ?? null,
        Number(customer_id),
        Number(vehicle_id),
        mechanic_user_id ?? null,
        req.user.id,
        start_at ?? null,
        end_at ?? null
      ]
    );

    const created = await get(
      `SELECT
        id,
        service,
        status,
        opis,
        customer_id,
        vehicle_id,
        mechanic_user_id,
        created_by_user_id,
        start_at,
        end_at,
        created_at
       FROM orders
       WHERE id = ?`,
      [result.lastID]
    );

    res.status(201).json({ success: true, message: "Created", data: created });
  } catch (e: any) {
    res.status(500).json({ success: false, message: e?.message || "DB error" });
  }
}

/* =========================
   UPDATE ORDER
   ========================= */
export async function updateOrder(req: AuthRequest, res: Response) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Brak autoryzacji" });
  }

  const id = Number(req.params.id);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ success: false, message: "Nieprawidłowe id" });
  }

  const { status, opis } = req.body ?? {};
  if (status == null && opis == null) {
    return res.status(400).json({ success: false, message: "Podaj status lub opis" });
  }

  if (status != null && !allowedStatuses.has(String(status))) {
    return res.status(400).json({
      success: false,
      message: "Nieprawidłowy status",
      allowed: Array.from(allowedStatuses)
    });
  }

  const order = await get<{
    id: number;
    created_by_user_id: number;
  }>(
    `SELECT id, created_by_user_id FROM orders WHERE id = ?`,
    [id]
  );

  if (!order) {
    return res.status(404).json({ success: false, message: "Order not found" });
  }

  const isAdmin = req.user.rola === "admin";
  const isOwner = order.created_by_user_id === req.user.id;

  if (!isAdmin && !isOwner) {
    return res.status(403).json({ success: false, message: "Brak uprawnień" });
  }

  const fields: string[] = [];
  const params: any[] = [];

  if (status != null) {
    fields.push("status = ?");
    params.push(String(status));
  }

  if (opis != null) {
    fields.push("opis = ?");
    params.push(opis);
  }

  params.push(id);

  await run(`UPDATE orders SET ${fields.join(", ")} WHERE id = ?`, params);

  const updated = await get(
    `SELECT
      id,
      service,
      status,
      opis,
      customer_id,
      vehicle_id,
      mechanic_user_id,
      created_by_user_id,
      start_at,
      end_at,
      created_at
     FROM orders
     WHERE id = ?`,
    [id]
  );

  res.json({ success: true, message: "Updated", data: updated });
}
