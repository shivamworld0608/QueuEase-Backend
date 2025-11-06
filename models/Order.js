import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    shopId: { type: mongoose.Schema.Types.ObjectId, ref: "Shop"},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },

    items: [
      {
        itemId: { type: mongoose.Schema.Types.ObjectId, ref: "ShopMenu" },
        quantity: { type: Number, default: 1 }
      }
    ],

    payment: {
      paymentStatus: {
        type: String,
        enum: ["Success", "Pending", "Failed"],
        default: "Pending"
      },
      paymentAmount: { type: Number, default: 0 },
      paymentDateTime: { type: Date }
    },

    orderStatus: {
      type: String,
      enum: ["Completed","InProgress", "Cancelled"],
      default: "Pending"
    },

    waitTime: {type: Date, default: () => new Date(Date.now() + (15*60*1000))},

    tokenNo: { type: Number, required: true },

    OrderDateTime: { type: Date, default: Date.now },

    notes: { type: String },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
