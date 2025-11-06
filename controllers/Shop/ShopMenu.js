import ShopMenu from "../../models/ShopMenu.js";
import fs from "fs";
import path from "path";

// helper to compute full path from filename or relative input
const imageFullPath = (img) => {
  if (!img) return null;
  // if img already contains uploads/Shop-Menu/, strip and take filename
  const filename = img.includes("Shop-Menu") ? path.basename(img) : img;
  return path.join(process.cwd(), "uploads", "Shop-Menu", filename);
};

const deleteImageFile = (img) => {
  if (!img) return;
  try {
    const full = imageFullPath(img);
    if (fs.existsSync(full)) fs.unlinkSync(full);
  } catch (e) {
    // Log but don't fail the main operation
    console.error("deleteImageFile error:", e);
  }
};

// Add menu item (POST /shop/shop-menu/:shopId)
// Expect multipart/form-data with field 'image' (optional) and text fields itemName, quantity, unit, price
export const addMenuItem = async (req, res) => {
  try {
    const { shopId } = req.params;
    const { itemName, quantity, unit, price } = req.body;

    const imageFilename = req.file ? req.file.filename : null;

    let shopMenu = await ShopMenu.findOne({ shopId });

    const newItem = {
      itemName,
      quantity: quantity ? Number(quantity) : undefined,
      unit,
      price: price ? Number(price) : undefined,
      image: imageFilename || undefined,
    };

    if (!shopMenu) {
      shopMenu = new ShopMenu({
        shopId,
        menu: [newItem],
      });
      await shopMenu.save();
    } else {
      shopMenu.menu.push(newItem);
      await shopMenu.save();
    }

    return res.status(201).json({ success: true, shopMenu });
  } catch (error) {
    console.error("addMenuItem:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Get menu items (GET /shop/shop-menu/:shopId)
export const getMenuItems = async (req, res) => {
  try {
    const { shopId } = req.params;
    const shopMenu = await ShopMenu.findOne({ shopId });
    if (!shopMenu) return res.status(200).json({ success: true, menu: [] });
    return res.status(200).json({ success: true, menu: shopMenu.menu });
  } catch (error) {
    console.error("getMenuItems:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Update menu item (PUT /shop/shop-menu/:shopId/:itemId)
// Accepts multipart/form-data optionally with 'image' to replace image
export const updateMenuItem = async (req, res) => {
  try {
    const { shopId, itemId } = req.params;
    const { itemName, quantity, unit, price } = req.body;
    const newImage = req.file ? req.file.filename : null;

    const shopMenu = await ShopMenu.findOne({ shopId });
    if (!shopMenu) return res.status(404).json({ success: false, message: "Shop menu not found" });

    const idx = shopMenu.menu.findIndex((m) => m._id.toString() === itemId);
    if (idx === -1) return res.status(404).json({ success: false, message: "Item not found" });

    const oldImage = shopMenu.menu[idx].image;

    // update fields
    if (itemName !== undefined) shopMenu.menu[idx].itemName = itemName;
    if (quantity !== undefined) shopMenu.menu[idx].quantity = quantity ? Number(quantity) : undefined;
    if (unit !== undefined) shopMenu.menu[idx].unit = unit;
    if (price !== undefined) shopMenu.menu[idx].price = price ? Number(price) : undefined;
    if (newImage) shopMenu.menu[idx].image = newImage;

    await shopMenu.save();

    // if image replaced, delete old file
    if (newImage && oldImage && oldImage !== newImage) {
      deleteImageFile(oldImage);
    }

    return res.status(200).json({ success: true, shopMenu });
  } catch (error) {
    console.error("updateMenuItem:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Delete single menu item (DELETE /shop/shop-menu/:shopId/:itemId)
export const deleteMenuItem = async (req, res) => {
  try {
    const { shopId, itemId } = req.params;

    const shopMenu = await ShopMenu.findOne({ shopId });
    if (!shopMenu) return res.status(404).json({ success: false, message: "Shop menu not found" });

    const item = shopMenu.menu.find((m) => m._id.toString() === itemId);
    if (!item) return res.status(404).json({ success: false, message: "Item not found" });

    // delete image file if exists
    if (item.image) deleteImageFile(item.image);

    shopMenu.menu = shopMenu.menu.filter((m) => m._id.toString() !== itemId);
    await shopMenu.save();

    return res.status(200).json({ success: true, message: "Item removed" });
  } catch (error) {
    console.error("deleteMenuItem:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Bulk delete (POST /shop/shop-menu/bulk-delete) body: { shopId, ids: [itemId1, itemId2, ...] }
export const bulkDeleteMenuItems = async (req, res) => {
  try {
    const { shopId, ids } = req.body;
    if (!Array.isArray(ids)) return res.status(400).json({ success: false, message: "ids must be array" });

    const shopMenu = await ShopMenu.findOne({ shopId });
    if (!shopMenu) return res.status(404).json({ success: false, message: "Shop menu not found" });

    // delete files for items in ids
    shopMenu.menu.forEach((item) => {
      if (ids.includes(item._id.toString()) && item.image) {
        deleteImageFile(item.image);
      }
    });

    shopMenu.menu = shopMenu.menu.filter((item) => !ids.includes(item._id.toString()));
    await shopMenu.save();

    return res.status(200).json({ success: true, message: "Bulk items deleted" });
  } catch (error) {
    console.error("bulkDeleteMenuItems:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
