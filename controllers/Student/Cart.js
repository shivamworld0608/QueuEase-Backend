import Cart from "../../models/Cart.js";
import ShopMenu from "../../models/ShopMenu.js";

export const addToCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shopId, itemId, quantity } = req.body;

    let cart = await Cart.findOne({ userId, shopId });

    // if no cart -> create new
    if (!cart) {
      cart = await Cart.create({
        userId,
        shopId,
        items: [{ itemId, quantity }]
      });
      return res.json(cart);
    }

    // if exists, check if item already present
    const itemIndex = cart.items.findIndex(i => i.itemId.equals(itemId));

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += quantity;
    } else {
      cart.items.push({ itemId, quantity });
    }

    await cart.save();
    return res.json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const removeFromCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shopId, itemId } = req.body;

    let cart = await Cart.findOne({ userId, shopId });
    if (!cart) return res.json({ message: "Cart not found" });

    cart.items = cart.items.filter(i => !i.itemId.equals(itemId));

    await cart.save();
    return res.json(cart);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const updateQuantity = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shopId, itemId, quantity } = req.body;

    let cart = await Cart.findOne({ userId, shopId });
    if (!cart) return res.json({ message: "Cart not found" });

    const itemIndex = cart.items.findIndex(i => i.itemId.equals(itemId));

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      return res.json(cart);
    } else {
      return res.json({ message: "Item not found in cart" });
    }

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shopId } = req.params;
    const cart = await Cart.findOne({ userId, shopId });

if (!cart) return res.json({ message: "Empty cart" });

const shopMenu = await ShopMenu.findOne({ shopId });

const populatedItems = cart.items.map(cartItem => {
  const foundItem = shopMenu.menu.id(cartItem.itemId); // works if you store embedded _id
  return {
    ...cartItem.toObject(),
    itemId: foundItem || null,
  };
});

return res.json({ ...cart.toObject(), items: populatedItems });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const clearCart = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { shopId } = req.body;

    await Cart.findOneAndDelete({ userId, shopId });

    return res.json({ message: "Cart cleared" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
