const { Schema } = require("mongoose");

const CreatedPizzaSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  baseType: {
    name: { type: String, required: true },
  },
  sauce: {
    name: { type: String, required: true },
  },
  cheese: {
    name: { type: String, required: true },
  },
  veggies: [
    {
      name: { type: String, required: true },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { CreatedPizzaSchema };
