const OrderModel = require("../models/OrderModel");
const CreatedPizzaModel = require("../models/CreatedPizzasModel");
const BaseModel = require("../models/BaseModel");
const SauceModel = require("../models/SauceModel");
const CheeseModel = require("../models/CheeseModel");
const VeggieModel = require("../models/VeggieModel");
const PizzasModel = require("../models/PizzasModel");

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
      if (item.isCustom) {
        const pizza = await CreatedPizzaModel.findById(item.pizzaRef);
        if (!pizza) {
          return res.status(400).json({ message: "Invalid customized pizza" });
        }

        const qty = item.quantity || 1;

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
    const orders = await OrderModel.find({ user: req.user._id }).populate(
      "items.pizzaRef"
    );
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.GetOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderModel.findById(id).populate("items.pizzaRef");
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
