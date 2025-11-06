import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  batch: { type: String, required: true },
  course: { type: String, required: true },
  department: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true }
}, { timestamps: true });

const Student = mongoose.model('Student', studentSchema);
export default Student;