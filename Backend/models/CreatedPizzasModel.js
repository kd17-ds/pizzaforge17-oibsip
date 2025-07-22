const { model } = require("mongoose");

const { CreatedPizzaSchema } = require("../schema/CreatedPizzasSchema");

const CreatedPizzasModel = new model("CreatedPizza", CreatedPizzaSchema);

module.exports = CreatedPizzasModel;
