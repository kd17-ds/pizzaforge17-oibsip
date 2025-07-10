const { model } = require("mongoose");

const { PizzasSchema } = require("../schema/PizzasSchema");

const PizzasModel = new model("Pizza", PizzasSchema);

module.exports = PizzasModel;
