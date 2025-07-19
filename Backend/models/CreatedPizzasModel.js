const { model } = require("mongoose");

const { CreatedPizzasSchema } = require("../schema/CreatedPizzasSchema");

const CreatedPizzasModel = new model("CreatedPizza", CreatedPizzasSchema);

module.exports = CreatedPizzasModel;
