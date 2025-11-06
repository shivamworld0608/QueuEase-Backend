import express from "express";
import { addToCart, removeFromCart, updateQuantity, getCart, clearCart } from "../../controllers/Student/Cart.js";

const router = express.Router();

router.post("/add", addToCart);
router.post("/remove", removeFromCart);
router.put("/update", updateQuantity);
router.get("/:userId/:shopId", getCart);
router.post("/clear", clearCart);

export default router;
