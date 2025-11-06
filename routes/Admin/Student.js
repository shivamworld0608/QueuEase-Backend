import express from "express";
import { createStudent, getStudents, updateStudent, deleteStudent, bulkDeleteStudents } from "../../controllers/Admin/Student.js";

const router = express.Router();

router.post("/", createStudent);
router.get("/", getStudents);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);
router.post("/bulk-delete", bulkDeleteStudents);

export default router;