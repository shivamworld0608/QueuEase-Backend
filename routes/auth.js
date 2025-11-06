import express from "express";
const router=express.Router();

import {login,logout,checkAuth} from "../controllers/auth.js";

router.post("/login",login);
router.post('/logout',logout);

export default router;