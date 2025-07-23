const { model } = require("mongoose");

const { OrdersSchema } = require("../schema/OrdersSchema");

const OrderModel = new model("Order", OrdersSchema);

module.exports = OrderModel;
