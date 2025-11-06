import Shop from "../../models/user_model/Shop.js";

// CREATE SHOP
export const createShop = async (req, res) => {
  try {
    const shop = await Shop.create(req.body);
    return res.status(201).json({ success: true, shop });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// GET SHOPS
export const getShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    return res.status(200).json({ success: true, shops });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

// EDIT SHOP (UPDATE)
export const updateShop = async (req, res) => {
  try {
    const { id } = req.params;
    const shop = await Shop.findByIdAndUpdate(id, req.body, { new: true });
    return res.status(200).json({ success: true, shop });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// DELETE SINGLE SHOP
export const deleteShop = async (req, res) => {
  try {
    const { id } = req.params;
    await Shop.findByIdAndDelete(id);
    return res.status(200).json({ success: true, message: "Shop deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};

// BULK DELETE SHOPS
export const bulkDeleteShops = async (req, res) => {
  try {
    const { ids } = req.body; // expecting ids: [..ids]
    await Shop.deleteMany({ _id: { $in: ids } });
    return res.status(200).json({ success: true, message: "Shops deleted" });
  } catch (err) {
    return res.status(400).json({ success: false, message: err.message });
  }
};
