import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import path from "path";


import { restrictTo } from "./utils/restrict.js";
import { checkAuth } from "./controllers/auth.js";

import authRoutes from "./routes/auth.js";
import shopRoutesAdmin from "./routes/Admin/Shop.js";
import studentRoutesAdmin from "./routes/Admin/Student.js";
import adminRoutesAdmin from "./routes/Admin/Admin.js";

import shopMenuRoutesShop from "./routes/Shop/ShopMenu.js";
import orderRoutesShop from "./routes/Shop/Order.js";

import shopRoutesStudent from "./routes/Student/Shop.js";
import cartRoutesStudent from "./routes/Student/Cart.js";
import placeOrderRoutesStudent from "./routes/Student/PlaceOrder.js";
import orderRoutesStudent from "./routes/Student/Order.js";

const app = express();
dotenv.config();
app.use(cors({credentials: true, origin: process.env.CLIENT_URL}));
app.use(express.json());


const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(401).json({ msg: "Authorization header missing" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ msg: "Invalid or expired token" });
  }
};

mongoose.connect(process.env.MONGO_URI)
.then(()=>{
 console.log("Connected to MongoDB");
})
.catch((err)=>{
 console.error("Error connecting to MongoDB:", err);
})


app.use("/uploads/Shop-Menu", express.static(path.join(process.cwd(), "uploads", "Shop-Menu")));

app.get('/check-auth', authenticate, checkAuth );


app.use('/auth', authRoutes);

//Admin Routes
app.use('/admin/shop', authenticate, restrictTo('Admin'), shopRoutesAdmin);
app.use('/admin/student', authenticate, restrictTo('Admin'), studentRoutesAdmin);
app.use('/admin/admin', authenticate, restrictTo('Admin'), adminRoutesAdmin);

//Shop Routes
app.use('/shop/shop-menu', authenticate, restrictTo('Shop'), shopMenuRoutesShop);
app.use('/shop/order', authenticate, restrictTo('Shop'), orderRoutesShop);

//Student Routes
app.use('/student/shop', authenticate, restrictTo('Student'), shopRoutesStudent);
app.use('/student/cart', authenticate, restrictTo('Student'), cartRoutesStudent);
app.use('/student/place-order', authenticate, restrictTo('Student'), placeOrderRoutesStudent);
app.use('/student/order', authenticate, restrictTo('Student'), orderRoutesStudent);


app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });