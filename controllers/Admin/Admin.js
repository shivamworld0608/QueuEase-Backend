import Admin from "../../models/user_model/Admin.js";

export const createAdmin = async (req, res) => {
  try {
    const admin = await Admin.create(req.body);
    res.status(201).json({ success: true, admin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getAdmins = async (req, res) => {
  try {
    const admins = await Admin.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    await Admin.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Admin deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const bulkDeleteAdmins = async (req, res) => {
  try {
    const { ids } = req.body;
    await Admin.deleteMany({ _id: { $in: ids } });
    res.status(200).json({ success: true, message: "Bulk admins deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
