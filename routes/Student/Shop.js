import express from "express";
import {getShops,getShopMenu} from "../../controllers/Student/Shop.js";

const router = express.Router();

router.get("/", getShops);
router.get("/shop-menu/:shopId", getShopMenu);

export default router;