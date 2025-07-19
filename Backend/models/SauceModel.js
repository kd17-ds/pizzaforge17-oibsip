const { model } = require("mongoose");

const { SauceSchema } = require("../schema/SauceSchema");

const SauceModel = new model("Sauce", SauceSchema);

module.exports = SauceModel;
