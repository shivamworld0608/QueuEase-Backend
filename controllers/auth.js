import Shop from "../models/user_model/Shop.js";
import Student from "../models/user_model/Student.js";
import Admin from "../models/user_model/Admin.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const login = async (req, res) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const student=await Student.findOne({ email });
    const shop=await Shop.findOne({ email });
    const admin=await Admin.findOne({ email });
    let user=student || shop || admin;
    if (!user) return res.status(404).json({ msg: 'User not found' });

    let isPasswordValid;
    if (user.password.startsWith('$2')) {
    isPasswordValid = await bcrypt.compare(password, user.password);} 
    else {
    isPasswordValid = password === user.password;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    await user.updateOne({ password: hashedPassword });}

    if (!isPasswordValid) return res.status(401).json({ msg: 'Invalid credentials' });
    
    let userType = "";
          if (user == student) userType = "Student";
          else if (user == shop) userType = "Shop";
          else if (user == admin) userType = "Admin";
    const token = jwt.sign({ userId: user._id, userType: userType}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN  });
             if (!token) {
              return res.status(500).json({ message: "Failed to generate token" });
          }
    res.status(200).json({ msg: 'Login successful', token, user:user, userType:userType });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};


export const logout = (req, res) => {
    res.status(200).json({ message: 'Logged out successfully' });
  }


export const checkAuth = async(req, res) => {
    const student=await Student.findById(req.user.userId);
    const shop=await Shop.findById(req.user.userId);
    const admin=await Admin.findById(req.user.userId);
    const user=student || shop || admin;
    if(!user) return res.status(404).json({ message: 'User not found' });
    res.status(200).json({ message: 'User is authenticated', user:user, userType:req.user.userType });
  }
