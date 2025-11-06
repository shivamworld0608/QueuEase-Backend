import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student", required: true },

    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "ShopMenu.menu" },
        quantity: { type: Number, default: 1 }
      }
    ]
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
