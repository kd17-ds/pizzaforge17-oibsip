const { Schema } = require("mongoose");

const PizzasSchema = new Schema({
  name: {
    type: String,
    required: [true, "Pizza name is required"],
  },
  category: {
    type: String,
    enum: ["Veg", "Non-Veg"],
    required: [true, "Category is required"],
  },
  availability: {
    type: Boolean,
    default: true,
    required: [true, "Availability Status is  required"],
  },
  description: {
    type: String,
    required: [true, "Enter Pizza Description"],
  },
  image_url: {
    type: String,
    required: [true, "Enter image Url"],
  },
  prices: {
    small: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true },
  },
});

module.exports = { PizzasSchema };
