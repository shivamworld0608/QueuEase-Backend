import express from "express";
import { createAdmin, getAdmins, updateAdmin, deleteAdmin, bulkDeleteAdmins } from "../../controllers/Admin/Admin.js";

const router = express.Router();

router.post("/", createAdmin);
router.get("/", getAdmins);
router.put("/:id", updateAdmin);
router.delete("/:id", deleteAdmin);
router.post("/bulk-delete", bulkDeleteAdmins);

export default router;
