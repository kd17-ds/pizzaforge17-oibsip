const { model } = require("mongoose");

const { CartSchema } = require("../schema/CartSchema");

const CartModel = new model("Cart", CartSchema);

module.exports = CartModel;
