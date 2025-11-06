import Student from "../../models/user_model/Student.js";

export const createStudent = async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json({ success: true, student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getStudents = async (req, res) => {
  try {
    const { rollNo, name, batch, course, department } = req.query;

    let filter = {};

    if (rollNo) filter.rollNo = rollNo;      
    if (name) filter.name = name;            
    if (batch) filter.batch = batch;
    if (course) filter.course = course;
    if (department) filter.department = department;

    const students = await Student.find(filter).sort({ createdAt: -1 });
    res.status(200).json({ success: true, students });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};


export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, student });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkDeleteStudents = async (req, res) => {
  try {
    const { ids } = req.body;
    await Student.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, message: "Bulk students deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
