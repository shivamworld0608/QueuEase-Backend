import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  itemName: {type: String,},
  quantity: {type: Number,},
  unit: {type: String,},
  price: {type: Number,},
  image: {type: String,},
});

const shopMenuSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId,ref: "Shop"},
    menu: [menuItemSchema],
  },
  { timestamps: true }
);

const ShopMenu = mongoose.model("ShopMenu", shopMenuSchema);
export default ShopMenu;
