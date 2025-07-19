const { model } = require("mongoose");

const { VeggieSchema } = require("../schema/VeggieSchema");

const VeggieModel = new model("Veggie", VeggieSchema);

module.exports = VeggieModel;
