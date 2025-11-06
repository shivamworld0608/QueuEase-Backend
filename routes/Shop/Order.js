import express from "express";
import {
  getInProgressOrders,
  updateOrder,
  deleteOrder,
  bulkDeleteOrders,
  getCompletedOrders,
  getOrderById
} from "../../controllers/Shop/Order.js";

const router = express.Router();

router.get("/in-progress", getInProgressOrders);
router.patch("/:orderId", updateOrder);
router.delete("/:orderId", deleteOrder);
router.delete("/bulk", bulkDeleteOrders);
router.get("/completed", getCompletedOrders);
router.get("/:orderId", getOrderById);

export default router;