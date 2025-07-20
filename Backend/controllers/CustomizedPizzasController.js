const BaseModel = require("../models/BaseModel");
const SauceModel = require("../models/SauceModel");
const CheeseModel = require("../models/CheeseModel");
const VeggieModel = require("../models/VeggieModel");

const models = {
  base: BaseModel,
  sauce: SauceModel,
  cheese: CheeseModel,
  veggie: VeggieModel,
};

const getModelByType = (type) => {
  const model = models[type];
  if (!model) throw new Error("Invalid type provided");
  return model;
};

module.exports.AddIngredients = async (req, res) => {
  try {
    const { type } = req.query;
    const Model = getModelByType(type);
    const { name, price, availableQty, isAvailable, createdAt } = req.body;

    const newItem = await Model.create({
      name,
      price,
      availableQty,
      isAvailable,
      createdAt,
    });

    res
      .status(201)
      .json({ message: `${type} added successfully`, data: newItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.ShowAllIngredients = async (req, res) => {
  try {
    const base = await models.base.find({});
    const sauce = await models.sauce.find({});
    const cheese = await models.cheese.find({});
    const veggie = await models.veggie.find({});

    res.status(200).json({
      base,
      sauce,
      cheese,
      veggie,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch ingredients",
      error: err.message,
    });
  }
};

module.exports.GetIngredientsDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const Model = getModelByType(type);

    const item = await Model.findById(id);
    if (!item) {
      return res.status(400).json({ message: `No such ${type} found` });
    }

    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.UpdateIngredientsDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const Model = getModelByType(type);

    const updatedItem = await Model.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedItem) {
      return res.status(400).json({ message: `No such ${type} found` });
    }

    res
      .status(200)
      .json({ message: `${type} updated successfully`, data: updatedItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.DeleteIngridient = async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.query;
    const Model = getModelByType(type);

    const deletedItem = await Model.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(400).json({ message: `No such ${type} found` });
    }

    res
      .status(200)
      .json({ message: `${type} deleted successfully`, data: deletedItem });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
