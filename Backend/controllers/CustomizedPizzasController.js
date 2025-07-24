const BaseModel = require("../models/BaseModel");
const SauceModel = require("../models/SauceModel");
const CheeseModel = require("../models/CheeseModel");
const VeggieModel = require("../models/VeggieModel");
const CreatedPizzaModel = require("../models/CreatedPizzasModel");

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

module.exports.CustomizedPizza = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const { baseType, sauce, cheese, veggies, totalPrice } = req.body;

    const base = await BaseModel.findById(baseType);
    const sauceItem = await SauceModel.findById(sauce);
    const cheeseItem = await CheeseModel.findById(cheese);

    if (!base || base.availableQty <= 0)
      return res.status(400).json({ message: "Base not available" });

    if (!sauceItem || sauceItem.availableQty <= 0)
      return res.status(400).json({ message: "Sauce not available" });

    if (!cheeseItem || cheeseItem.availableQty <= 0)
      return res.status(400).json({ message: "Cheese not available" });

    const veggieDocs = [];
    for (const veggieId of veggies) {
      const veg = await VeggieModel.findById(veggieId);
      if (!veg || veg.availableQty <= 0) {
        return res
          .status(400)
          .json({ message: `Veggie ${veg?.name || ""} not available` });
      }
      veggieDocs.push({ name: veg.name, price: veg.price });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Total price is required" });
    }

    console.log("Creating pizza for user:", req.user._id);
    const newPizza = await CreatedPizzaModel.create({
      user: req.user._id,
      baseType: { name: base.name, price: base.price },
      sauce: { name: sauceItem.name, price: sauceItem.price },
      cheese: { name: cheeseItem.name, price: cheeseItem.price },
      veggies: veggieDocs,
      totalPrice,
    });

    res.status(201).json({
      message: "Pizza created successfully",
      data: newPizza,
    });
  } catch (err) {
    console.error("Pizza creation failed:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports.UserCreatedPizzas = async (req, res) => {
  try {
    const createdPizzas = await CreatedPizzaModel.find({ user: req.user._id })
      .populate("baseType")
      .populate("sauce")
      .populate("cheese")
      .populate("veggies");
    res.status(200).json(createdPizzas);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.GetCustomizedPizzaDetail = async (req, res) => {
  try {
    const id = req.params.id;
    const sentPizza = await CreatedPizzaModel.findById(id)
      .populate("baseType")
      .populate("sauce")
      .populate("cheese")
      .populate("veggies");
    res.status(200).json(sentPizza);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports.UpdateCustomizedPizza = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized user" });
    }

    const { baseType, sauce, cheese, veggies, totalPrice } = req.body;

    const base = await BaseModel.findById(baseType);
    const sauceItem = await SauceModel.findById(sauce);
    const cheeseItem = await CheeseModel.findById(cheese);

    if (!base || base.availableQty <= 0)
      return res.status(400).json({ message: "Base not available" });

    if (!sauceItem || sauceItem.availableQty <= 0)
      return res.status(400).json({ message: "Sauce not available" });

    if (!cheeseItem || cheeseItem.availableQty <= 0)
      return res.status(400).json({ message: "Cheese not available" });

    const veggieDocs = [];
    for (const veggieId of veggies) {
      const veg = await VeggieModel.findById(veggieId);
      if (!veg || veg.availableQty <= 0) {
        return res
          .status(400)
          .json({ message: `Veggie ${veg?.name || ""} not available` });
      }
      veggieDocs.push({ name: veg.name, price: veg.price });
    }

    if (!totalPrice || totalPrice <= 0) {
      return res.status(400).json({ message: "Total price is required" });
    }

    console.log("Updating pizza for user:", req.user._id);
    const newPizza = await CreatedPizzaModel.findByIdAndUpdate(
      req.params.id,
      {
        user: req.user._id,
        baseType: { name: base.name, price: base.price },
        sauce: { name: sauceItem.name, price: sauceItem.price },
        cheese: { name: cheeseItem.name, price: cheeseItem.price },
        veggies: veggieDocs,
        totalPrice,
      },
      { new: true }
    );

    res.status(201).json({
      message: "Pizza Updated successfully",
      data: newPizza,
    });
  } catch (err) {
    console.error("Pizza Updation failed:", err);
    res.status(500).json({ message: err.message });
  }
};

module.exports.DeleteCustomizedPizza = async (req, res) => {
  try {
    const pizza = await CreatedPizzaModel.findByIdAndDelete(req.params.id);
    if (!pizza) {
      return res.status(404).json({ message: "Pizza not found" });
    }
    res.status(200).json({ message: "Pizza deleted successfully" });
  } catch (err) {
    console.error("Error deleting pizza:", err);
  }
};
