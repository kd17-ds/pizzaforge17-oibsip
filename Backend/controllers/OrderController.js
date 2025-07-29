const OrderModel = require("../models/OrderModel");
const CreatedPizzaModel = require("../models/CreatedPizzasModel");
const BaseModel = require("../models/BaseModel");
const SauceModel = require("../models/SauceModel");
const CheeseModel = require("../models/CheeseModel");
const VeggieModel = require("../models/VeggieModel");
const PizzasModel = require("../models/PizzasModel");
const CartModel = require("../models/CartModel");
const { sendEmail } = require("../utils/sendEmail");
const checkAndAlertLowStock = require("../utils/checkAndAlertLowStock");
const Razorpay = require("razorpay");
const crypto = require("crypto");

let razorpay = null;

if (process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_SECRET) {
  razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_SECRET,
  });
}

// Create Order route
// module.exports.CreateRazorpayOrder = async (req, res) => {
//   const { amount } = req.body;

//   const options = {
//     amount: amount * 100,
//     currency: "INR",
//     receipt: `receipt_order_${Date.now()}`,
//   };

//   if (!razorpay) {
//     return res
//       .status(503)
//       .json({ message: "Razorpay not initialized yet. Try again later." });
//   }

//   try {
//     const order = await razorpay.orders.create(options);
//     res.status(200).json(order);
//   } catch (err) {
//     res
//       .status(500)
//       .json({ message: "Failed to create Razorpay order", error: err.message });
//   }
// };

// Fake CreateRazorpayOrder for development
module.exports.CreateRazorpayOrder = async (req, res) => {
  const fakeOrder = {
    id: "fake_order_id_123",
    amount: req.body.amount * 100,
    currency: "INR",
    status: "created",
  };

  res.status(200).json(fakeOrder);
};

module.exports.PlaceOrderAfterPayment = async (req, res) => {
  try {
    const { items, totalPrice, shippingAddress, razorpayDetails } = req.body;

    // map Razorpay details
    const paymentId = razorpayDetails.razorpay_payment_id;
    const paymentDate = new Date(); // now
    const paymentMethod = "Razorpay";
    const paymentStatus = "Paid"; // since Razorpay confirms payment
    const status = "Placed";

    // Call your existing logic (or extract it to a reusable function)
    return await module.exports.CreateOrder(
      {
        ...req,
        body: {
          items,
          totalPrice,
          shippingAddress,
          paymentMethod,
          paymentStatus,
          paymentId,
          paymentDate,
          status,
        },
      },
      res
    );
  } catch (err) {
    return res.status(500).json({ message: err.message || "Order failed" });
  }
};

module.exports.CreateOrder = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const {
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paymentId,
      paymentDate,
      status,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items to place order" });
    }

    for (const item of items) {
      const qty = item.quantity || 1;

      if (!qty || qty < 1) {
        return res
          .status(400)
          .json({ message: "Invalid quantity for an item." });
      }

      if (item.isCustom) {
        const pizza = await CreatedPizzaModel.findById(item.pizzaRef);
        if (!pizza) {
          return res.status(400).json({ message: "Invalid customized pizza" });
        }

        const base = await BaseModel.findOne({ name: pizza.baseType.name });
        if (!base || base.availableQty < qty) {
          return res
            .status(400)
            .json({ message: `Insufficient base: ${pizza.baseType.name}` });
        }
        base.availableQty -= qty;
        await base.save();
        await checkAndAlertLowStock(base, "Base");

        const sauce = await SauceModel.findOne({ name: pizza.sauce.name });
        if (!sauce || sauce.availableQty < qty) {
          return res
            .status(400)
            .json({ message: `Insufficient sauce: ${pizza.sauce.name}` });
        }
        sauce.availableQty -= qty;
        await sauce.save();
        await checkAndAlertLowStock(sauce, "Sauce");

        const cheese = await CheeseModel.findOne({ name: pizza.cheese.name });
        if (!cheese || cheese.availableQty < qty) {
          return res
            .status(400)
            .json({ message: `Insufficient cheese: ${pizza.cheese.name}` });
        }
        cheese.availableQty -= qty;
        await cheese.save();
        await checkAndAlertLowStock(cheese, "Cheese");

        for (const veg of pizza.veggies) {
          const veggie = await VeggieModel.findOne({ name: veg.name });
          if (!veggie || veggie.availableQty < qty) {
            return res
              .status(400)
              .json({ message: `Insufficient veggie: ${veg.name}` });
          }
          veggie.availableQty -= qty;
          await veggie.save();
          await checkAndAlertLowStock(veggie, "Veggie");
        }
      } else {
        const pizza = await PizzasModel.findById(item.pizzaRef);
        if (!pizza || pizza.availability !== true) {
          return res.status(400).json({ message: "Invalid regular pizza" });
        }
      }
    }

    const { fullName, phone, pincode, city, state, street } =
      shippingAddress || {};
    if (!fullName || !phone || !pincode || !city || !state || !street) {
      return res.status(400).json({ message: "Incomplete shipping address" });
    }

    const newOrder = await OrderModel.create({
      user: req.user._id,
      items,
      totalPrice,
      shippingAddress,
      paymentMethod,
      paymentStatus,
      paymentId,
      paymentDate,
      status,
    });

    await CartModel.deleteOne({ userId: req.user._id });

    const userEmail = req.user.email;
    const userName = req.user.username;

    const emailContent = `
                    <h2>Hi ${userName},</h2>
                    <p>Your order has been placed successfully!</p>
                    <p><strong>Order ID:</strong> ${newOrder._id}</p>
                    <p><strong>Total:</strong> ₹${newOrder.totalPrice}</p>
                    <p><strong>Shipping To:</strong> ${newOrder.shippingAddress.street}, ${newOrder.shippingAddress.city} - ${newOrder.shippingAddress.pincode}</p>
                    <p>We'll notify you once it’s out for delivery 🍕</p>
                    <br/>
                    <p>Thanks for ordering with us!</p>
                      `;

    sendEmail(userEmail, "Order Confirmation - Pizza App", emailContent);

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminContent = `
                      <h2>New Order Received</h2>
                      <p><strong>User:</strong> ${userName} (${userEmail})</p>
                      <p><strong>Order ID:</strong> ${newOrder._id}</p>
                      <p><strong>Total:</strong> ₹${newOrder.totalPrice}</p>
                      <p><strong>Shipping Address:</strong> ${newOrder.shippingAddress.street}, ${newOrder.shippingAddress.city} - ${newOrder.shippingAddress.pincode}</p>
                      <p><strong>Status:</strong> ${newOrder.status}</p>
                      <p><strong>Payment:</strong> ${newOrder.paymentStatus} via ${newOrder.paymentMethod}</p>
                    `;

    sendEmail(adminEmail, "📦 New Pizza Order Received", adminContent);

    res.status(201).json({
      message: "Order placed successfully",
      data: newOrder,
    });
  } catch (err) {
    console.error("Order placement failed:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports.GetUserOrders = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const rawOrders = await OrderModel.find({ user: req.user._id });

    const populatedOrders = [];

    for (const order of rawOrders) {
      const populatedItems = [];

      for (const item of order.items) {
        let pizzaDoc = null;

        if (item.modelRef === "Pizza") {
          pizzaDoc = await PizzasModel.findById(item.pizzaRef);
        } else if (item.modelRef === "CreatedPizza") {
          pizzaDoc = await CreatedPizzaModel.findById(item.pizzaRef);
        }

        populatedItems.push({
          ...item.toObject(),
          pizzaRef: pizzaDoc,
        });
      }

      populatedOrders.push({
        ...order.toObject(),
        items: populatedItems,
      });
    }

    res.status(200).json(populatedOrders);
  } catch (err) {
    console.error("GetUserOrders error:", err);
    res.status(500).json({ message: "Failed to fetch user orders" });
  }
};

module.exports.GetOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const rawOrder = await OrderModel.findById(id);
    if (!rawOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    const populatedItems = [];

    for (const item of rawOrder.items) {
      let pizzaDoc = null;

      if (item.modelRef === "Pizza") {
        pizzaDoc = await PizzasModel.findById(item.pizzaRef);
      } else if (item.modelRef === "CreatedPizza") {
        pizzaDoc = await CreatedPizzaModel.findById(item.pizzaRef);
      }

      populatedItems.push({
        ...item.toObject(),
        pizzaRef: pizzaDoc,
      });
    }

    const populatedOrder = {
      ...rawOrder.toObject(),
      items: populatedItems,
    };

    res.status(200).json(populatedOrder);
  } catch (err) {
    console.error("GetOrderById error:", err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

module.exports.GetCart = async (req, res) => {
  try {
    const userId = req.user._id;
    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(200).json({ items: [] });
    }

    return res.status(200).json(cart);
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res.status(500).json({ message: "Server Error" });
  }
};

module.exports.UpdateOrCreateCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items } = req.body;

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Cart items must be an array." });
    }

    const updatedCart = await CartModel.findOneAndUpdate(
      { userId },
      {
        $set: {
          items,
          updatedAt: Date.now(),
        },
      },
      { new: true, upsert: true }
    );

    return res.status(200).json({
      message: "Cart updated successfully",
      cart: updatedCart,
    });
  } catch (err) {
    console.error("Update/Create Cart Error:", err);
    return res.status(500).json({ message: "Server error updating cart" });
  }
};

module.exports.GetAllOrders = async (req, res) => {
  try {
    const rawOrders = await OrderModel.find()
      .populate("user")
      .sort({ createdAt: -1 });

    const populatedOrders = [];

    for (const order of rawOrders) {
      const populatedItems = [];

      for (const item of order.items) {
        let pizzaDoc = null;

        if (item.modelRef === "PizzasModel") {
          pizzaDoc = await PizzasModel.findById(item.pizzaRef);
        }

        populatedItems.push({
          ...item.toObject(),
          pizzaRef: pizzaDoc,
        });
      }

      populatedOrders.push({
        ...order.toObject(),
        items: populatedItems,
      });
    }

    res.status(200).json(populatedOrders);
  } catch (err) {
    console.error("GetAllOrders error:", err);
    res.status(500).json({ message: "Failed to fetch all orders" });
  }
};

module.exports.UpdateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await OrderModel.findById(req.params.id).populate("user");

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = status;
    await order.save();

    const adminEmail = process.env.ADMIN_EMAIL;
    const statusUpdateContent = `
      <h2>Order Status Updated</h2>
      <p><strong>Order ID:</strong> ${order._id}</p>
      <p><strong>New Status:</strong> ${status}</p>
    `;
    if (adminEmail) {
      sendEmail(
        adminEmail,
        "🔄 Pizza Order Status Changed",
        statusUpdateContent
      );
    }

    const userEmail = order.user?.email;
    const userName = order.user?.username;

    if (userEmail) {
      const statusUpdateContentUser = `
        <h2>Hi ${userName || "Customer"},</h2>
        <p>Your order <strong>${order._id}</strong> status has been updated.</p>
        <p><strong>New Status:</strong> ${status}</p>
        <p>We'll keep you posted as your delicious pizza gets closer to you! 🍕</p>
        <br/>
        <p>Thanks for ordering with us!</p>
      `;
      sendEmail(
        userEmail,
        "📦 Your Pizza Order Status Has Changed",
        statusUpdateContentUser
      );
    } else {
      console.warn("⚠️ No user email found — skipping email to customer.");
    }

    res.status(200).json({ message: "Order status updated", data: order });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update status", error: err.message });
  }
};
