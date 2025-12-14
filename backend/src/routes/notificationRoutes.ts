import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();


router.get("/", requireAuth, async (_req, res) => {
  res.json({ success: true, message: "OK", data: [] });
});

export default router;
