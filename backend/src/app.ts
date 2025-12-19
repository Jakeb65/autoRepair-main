import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/authRoutes.js";
import meRoutes from "./routes/meRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import vehicleRoutes from "./routes/vehicleRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import partRoutes from "./routes/partRoutes.js";
import invoiceRoutes from "./routes/invoiceRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import adminUsersRoutes from "./routes/adminUsers.routes.js";
const app = express();

// ESM dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// static
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// health
app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/me", meRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminUsersRoutes);

app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/parts", partRoutes);
app.use("/api/invoices", invoiceRoutes);
app.use("/api/messages", messageRoutes);




export default app;
