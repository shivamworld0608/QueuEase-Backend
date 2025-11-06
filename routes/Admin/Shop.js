import express from "express";
import { createShop, getShops, updateShop, deleteShop, bulkDeleteShops } from "../../controllers/Admin/Shop.js";

const router = express.Router();

router.post("/", createShop);
router.get("/", getShops);
router.put("/:id", updateShop);
router.delete("/:id", deleteShop);
router.post("/bulk-delete", bulkDeleteShops);

export default router;
