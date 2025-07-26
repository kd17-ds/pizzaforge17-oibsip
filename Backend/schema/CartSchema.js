const { Schema } = require("mongoose");

const CartItemsSchema = new Schema({
  pizzaRef: {
    type: Schema.Types.ObjectId,
    required: true,
    refPath: "items.modelRef",
  },
  quantity: { type: Number, required: true },
  isCustom: { type: Boolean, required: true },
  modelRef: {
    type: String,
    required: true,
    enum: ["PizzasModel", "CreatedPizzaModel"],
  },
  name: { type: String, required: true },
  size: {
    type: String,
    enum: ["small", "medium", "large"],
    required: true,
  },
  price: { type: Number, required: true },
});

const CartSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", unique: true },
    items: [CartItemsSchema],
  },
  { timestamps: true }
);

module.exports = { CartSchema };
