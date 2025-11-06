import express from "express";
import {
  addMenuItem,
  getMenuItems,
  updateMenuItem,
  deleteMenuItem,
  bulkDeleteMenuItems,
} from "../../controllers/Shop/ShopMenu.js";
import { uploadSingleImage } from "../../middlewares/multerShopMenu.js";

const router = express.Router();

router.post("/:shopId", uploadSingleImage, addMenuItem);
router.get("/:shopId", getMenuItems);
router.put("/:shopId/:itemId", uploadSingleImage, updateMenuItem);
router.delete("/:shopId/:itemId", deleteMenuItem);
router.post("/bulk-delete", bulkDeleteMenuItems);

export default router;
