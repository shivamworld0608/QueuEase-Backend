import Order from "../../models/Order.js";
import ShopMenu from "../../models/ShopMenu.js";

// 🧾 Helper to populate order items similar to cart example
const populateOrderItems = async (order) => {
  if (!order) return null;
  const shopMenu = await ShopMenu.findOne({ shopId: order.shopId });
  if (!shopMenu) return order;

  const populatedItems = order.items.map((orderItem) => {
    const foundItem = shopMenu.menu.id(orderItem.itemId); // subdocument match
    return {
      ...orderItem.toObject(),
      itemId: foundItem || null,
    };
  });

  return { ...order.toObject(), items: populatedItems };
};

// ✅ Get all InProgress orders for a student
export const getInProgressOrders = async (req, res) => {
  try {
    const userId = req.user.userId;
    console.log("User ID:", req.user.userId);


    const orders = await Order.find({ userId, orderStatus: "InProgress" })
      .sort({ createdAt: -1 });

     console.log("Inprogress",orders);
    const populatedOrders = await Promise.all(
      orders.map(async (o) => await populateOrderItems(o))
    );

    res.json(populatedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all Completed orders for a student
export const getCompletedOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ userId, orderStatus: "Completed" })
      .sort({ createdAt: -1 });

    const populatedOrders = await Promise.all(
      orders.map(async (o) => await populateOrderItems(o))
    );

    res.json(populatedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all Cancelled orders for a student
export const getCancelledOrders = async (req, res) => {
  try {
    const userId = req.user.userId;

    const orders = await Order.find({ userId, orderStatus: "Cancelled" })
      .sort({ createdAt: -1 });

    const populatedOrders = await Promise.all(
      orders.map(async (o) => await populateOrderItems(o))
    );

    res.json(populatedOrders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get single order by ID (with item population)
export const getOrderById = async (req, res) => {
  try {
    console.log(req.user);
    const userId = req.user.userId;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, userId });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const populatedOrder = await populateOrderItems(order);
    res.json(populatedOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get smallest InProgress token and order statuses in range
export const getTokenRangeStatus = async (req, res) => {
  try {
    const { shopId, orderId } = req.params;

    // Define current day range (same logic as your generateTokenNo)
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Get today's orders for this shop
    const todaysOrders = await Order.find({
      shopId,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    }).lean();

    if (!todaysOrders || todaysOrders.length === 0) {
      return res.status(404).json({ message: "No orders for this shop today" });
    }

    // Find smallest active token (InProgress)
    const inProgressOrders = todaysOrders.filter(
      (o) => o.orderStatus === "InProgress"
    );

    if (inProgressOrders.length === 0) {
      return res.status(404).json({ message: "No in-progress orders today" });
    }

    const smallestToken = Math.min(...inProgressOrders.map((o) => o.tokenNo));

    // Find current order
    const currentOrder = todaysOrders.find(
      (o) => o._id.toString() === orderId
    );

    if (!currentOrder) {
      return res.status(404).json({ message: "Order not found for today" });
    }

    const currentToken = currentOrder.tokenNo;

    // Get all orders within token range [smallestToken, currentToken]
    const tokenRangeOrders = todaysOrders
      .filter(
        (o) => o.tokenNo >= smallestToken && o.tokenNo <= currentToken
      )
      .map((o) => ({
        tokenNo: o.tokenNo,
        orderStatus: o.orderStatus,
      }))
      .sort((a, b) => a.tokenNo - b.tokenNo);

    res.json({
      smallestToken,
      currentToken,
      rangeStatuses: tokenRangeOrders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};