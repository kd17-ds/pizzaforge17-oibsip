const { model } = require("mongoose");

const { CheeseSchema } = require("../schema/CheeseSchema");

const CheeseModel = new model("Cheese", CheeseSchema);

module.exports = CheeseModel;
