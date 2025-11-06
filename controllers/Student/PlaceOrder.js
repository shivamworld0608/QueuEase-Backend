import Order from "../../models/Order.js";
import Cart from "../../models/Cart.js";
import ShopMenu from "../../models/ShopMenu.js";


// helper function -> auto token per shop per day reset
const generateTokenNo = async (shopId) => {

  const startOfDay = new Date();
  startOfDay.setHours(0,0,0,0);

  const endOfDay = new Date();
  endOfDay.setHours(23,59,59,999);

  // find last order of this shop today
  const lastOrder = await Order.findOne({
    shopId,
    createdAt: { $gte : startOfDay, $lte: endOfDay }
  }).sort({ tokenNo: -1 });

  if (!lastOrder) return 1;

  return lastOrder.tokenNo + 1;
}


export const placeOrder = async (req,res)=>{
  try{
    const userId = req.user.userId;
    const { shopId, paymentStatus, paymentAmount, notes } = req.body;

    // get cart data
    const cart = await Cart.findOne({ userId, shopId });
    if(!cart) return res.status(400).json({ message:"Cart empty" });

    // generate token
    const tokenNo = await generateTokenNo(shopId);

    // create new order
    const newOrder = await Order.create({
      shopId,
      userId,
      items: cart.items,
      orderStatus: "InProgress",
      tokenNo,
      OrderDateTime: new Date(),
      payment:{
        paymentStatus,
        paymentAmount,
        paymentDateTime: new Date()
      },
      notes
    });

    // clear cart after order placed
    await Cart.findOneAndDelete({userId, shopId});

    const shopMenu = await ShopMenu.findOne({ shopId });
    
    const populatedItems = newOrder.items.map(orderItem => {
      const foundItem = shopMenu.menu.id(orderItem.itemId); // works if you store embedded _id
      return {
        ...orderItem.toObject(),
        itemId: foundItem || null,
      };
    });
    
    return res.json({ ...newOrder.toObject(), items: populatedItems });


    // res.json(newOrder);

  }
  catch(err){
    res.status(500).json({error:err.message});
  }
}
