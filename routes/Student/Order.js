import express from "express";
import {
  getInProgressOrders,
  getCompletedOrders,
  getCancelledOrders,
  getOrderById,
  getTokenRangeStatus,
} from "../../controllers/Student/Order.js";

const router = express.Router();

router.get("/in-progress", getInProgressOrders);
router.get("/completed", getCompletedOrders);
router.get("/cancelled", getCancelledOrders);
router.get("/:orderId", getOrderById);
router.get("/tokenStatus/:shopId/:orderId", getTokenRangeStatus);

export default router;
