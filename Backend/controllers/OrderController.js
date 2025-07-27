const OrderModel = require("../models/OrderModel");
const CreatedPizzaModel = require("../models/CreatedPizzasModel");
const BaseModel = require("../models/BaseModel");
const SauceModel = require("../models/SauceModel");
const CheeseModel = require("../models/CheeseModel");
const VeggieModel = require("../models/VeggieModel");
const PizzasModel = require("../models/PizzasModel");
const CartModel = require("../models/CartModel");

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

        const sauce = await SauceModel.findOne({ name: pizza.sauce.name });
        if (!sauce || sauce.availableQty < qty) {
          return res
            .status(400)
            .json({ message: `Insufficient sauce: ${pizza.sauce.name}` });
        }
        sauce.availableQty -= qty;
        await sauce.save();

        const cheese = await CheeseModel.findOne({ name: pizza.cheese.name });
        if (!cheese || cheese.availableQty < qty) {
          return res
            .status(400)
            .json({ message: `Insufficient cheese: ${pizza.cheese.name}` });
        }
        cheese.availableQty -= qty;
        await cheese.save();

        for (const veg of pizza.veggies) {
          const veggie = await VeggieModel.findOne({ name: veg.name });
          if (!veggie || veggie.availableQty < qty) {
            return res
              .status(400)
              .json({ message: `Insufficient veggie: ${veg.name}` });
          }
          veggie.availableQty -= qty;
          await veggie.save();
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
          pizzaDoc = await CreatedPizzasModel.findById(item.pizzaRef);
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
        pizzaDoc = await CreatedPizzasModel.findById(item.pizzaRef);
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
