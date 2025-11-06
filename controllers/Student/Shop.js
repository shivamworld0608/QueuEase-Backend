import Shop from "../../models/user_model/Shop.js";
import ShopMenu from "../../models/ShopMenu.js";

// GET SHOPS
export const getShops = async (req, res) => {
  try {
    const shops = await Shop.find();
    return res.status(200).json({ success: true, shops });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};


// GET SHOP MENU
export const getShopMenu = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shopMenu = await ShopMenu.findOne({ shopId });
    // if (!shopMenu) return res.status(404).json({ success: false, message: "Shop menu not found" });
    return res.status(200).json({ success: true, menu: shopMenu?.menu||[] });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

