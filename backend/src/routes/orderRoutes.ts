import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { listOrders, createOrder, updateOrder } from "../controllers/orderController.js";

const router = Router();

router.get("/", requireAuth, listOrders);
router.post("/", requireAuth, createOrder);
router.patch("/:id", requireAuth, updateOrder);

export default router;
