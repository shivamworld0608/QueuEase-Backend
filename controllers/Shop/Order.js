import Order from "../../models/Order.js";
import ShopMenu from "../../models/ShopMenu.js";
import mongoose from "mongoose";

// Fetch all in-progress orders for the shop
export const getInProgressOrders = async (req, res) => {
  try {
    console.log(req.user);
    const shopId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "Invalid shop ID" });
    }

    const orders = await Order.find({
      shopId,
      orderStatus: "InProgress",
    })
      .populate("userId", "name email") // Populate user details if needed
      .populate("items.itemId", "name price") // Populate item details
      .sort({ createdAt: -1 }); // Sort by newest first

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching in-progress orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Edit order status and wait time
export const updateOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { orderStatus, waitTime } = req.body;
    const shopId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "Invalid order or shop ID" });
    }

    const order = await Order.findOne({ _id: orderId, shopId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    // Validate orderStatus if provided
    if (orderStatus && !["Completed", "InProgress", "Cancelled"].includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    // Update fields if provided
    if (orderStatus) order.orderStatus = orderStatus;
   if (waitTime !== undefined) {
  if (typeof waitTime !== "number" || waitTime < 0) {
    return res.status(400).json({ message: "Invalid wait time" });
  }
  order.waitTime = new Date(Date.now() + waitTime * 60 * 1000);
}

    await order.save();
    res.status(200).json({ message: "Order updated successfully", order });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a single order
export const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const shopId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "Invalid order or shop ID" });
    }

    const order = await Order.findOneAndDelete({ _id: orderId, shopId });
    if (!order) {
      return res.status(404).json({ message: "Order not found or unauthorized" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Bulk delete orders
export const bulkDeleteOrders = async (req, res) => {
  try {
    const { orderIds } = req.body; // Expecting an array of order IDs
    const shopId = req.user.userId;

    if (!Array.isArray(orderIds) || !orderIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return res.status(400).json({ message: "Invalid order IDs" });
    }

    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "Invalid shop ID" });
    }

    const result = await Order.deleteMany({
      _id: { $in: orderIds },
      shopId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "No orders found or unauthorized" });
    }

    res.status(200).json({ message: `${result.deletedCount} orders deleted successfully` });
  } catch (error) {
    console.error("Error bulk deleting orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Fetch all completed orders for the shop
export const getCompletedOrders = async (req, res) => {
  try {
    const shopId = req.user.userId;
    if (!mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "Invalid shop ID" });
    }

    const orders = await Order.find({
      shopId,
      orderStatus: "Completed",
    })
      .populate("userId", "name email") // Populate user details if needed
      .populate("items.itemId", "name price") // Populate item details
      .sort({ createdAt: -1 }); // Sort by newest first

    // if (!orders.length) {
    //   return res.status(404).json({ message: "No completed orders found" });
    // }

    res.status(200).json({ orders });
  } catch (error) {
    console.error("Error fetching completed orders:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


export const getOrderById = async (req, res) => {
  try {
    console.log("aa gye");
    const { orderId } = req.params;
    const shopId = req.user.userId;

    if (!mongoose.Types.ObjectId.isValid(orderId) || !mongoose.Types.ObjectId.isValid(shopId)) {
      return res.status(400).json({ message: "Invalid order or shop ID" });
    }

    const order = await Order.findOne({ _id: orderId, shopId });
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    console.log("orderbyid",order);

    const shopMenu = await ShopMenu.findOne({ shopId });

    const populatedItems = order.items.map(orderItem => {
    const foundItem = shopMenu.menu.id(orderItem.itemId); // works if you store embedded _id
    return {
    ...orderItem.toObject(),
    itemId: foundItem || null,
    };
});
    return res.status(200).json({ ...order.toObject(), items: populatedItems });
  } catch (error) {
    console.error("Error fetching order by ID:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};