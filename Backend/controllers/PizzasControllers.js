const PizzasModel = require("../models/PizzasModel");

module.exports.AddPizza = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      image_url,
      availability,
      prices: { small, medium, large },
    } = req.body;

    const newPizza = await PizzasModel.create({
      name,
      description,
      category,
      image_url,
      availability,
      prices: {
        small,
        medium,
        large,
      },
    });

    console.log("Pizza added:", newPizza);
    res
      .status(201)
      .json({ message: "Pizza added successfully", pizza: newPizza });
  } catch (err) {
    console.error("Error adding pizza:", err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

module.exports.ShowAllPizzas = async (req, res) => {
  try {
    const pizzas = await PizzasModel.find({});
    res.status(200).json(pizzas);
  } catch (err) {
    console.error("Error fetching pizzas:", err);
  }
};

module.exports.GetPizzaDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const pizza = await PizzasModel.findById(id);
    if (!pizza) {
      return res.status(400).json({ message: "No Such Pizza there" });
    }
    res.status(200).json(pizza);
  } catch (err) {
    console.error("Error fetching pizza:", err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

module.exports.UpdatePizzaDetails = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      name,
      description,
      category,
      image_url,
      availability,
      prices: { small, medium, large },
    } = req.body;

    const newPizza = await PizzasModel.findByIdAndUpdate(
      id,
      {
        name,
        description,
        category,
        image_url,
        availability,
        prices: { small, medium, large },
      },
      { new: true, runValidators: true }
    );
    if (!newPizza) {
      return res.status(400).json({ message: "No Such Pizza there" });
    }
    res.status(200).json({ message: "Pizza Updated Successfully", newPizza });
  } catch (err) {
    console.error("Error Updating pizza:", err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};

module.exports.DeletePizza = async (req, res) => {
  try {
    const id = req.params.id;
    const delpizza = await PizzasModel.findByIdAndDelete(id);
    if (!delpizza) {
      return res.status(400).json({ message: "No Such Pizza there" });
    }
    res.status(200).json({ message: "Pizza deleted successfully", delpizza });
  } catch (err) {
    console.error("Error Deleting pizza:", err);
    res
      .status(500)
      .json({ message: "Something went wrong", error: err.message });
  }
};
