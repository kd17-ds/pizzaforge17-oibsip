const { Schema } = require("mongoose");

const OrdersSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  items: [
    {
      isCustom: { type: Boolean, required: true },
      pizzaRef: {
        type: Schema.Types.ObjectId,
        refPath: "items.modelRef",
        required: true,
      },
      modelRef: {
        type: String,
        required: true,
        enum: ["PizzasModel", "CreatedPizzaModel"],
      },
      name: { type: String, required: true },
      size: { type: String, enum: ["small", "medium", "large"], default: null },
      price: { type: Number, required: true },
      quantity: { type: Number, default: 1 },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },

  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    pincode: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    street: { type: String, required: true },
    landmark: { type: String },
  },

  paymentMethod: {
    type: String,
    enum: ["COD", "Online"],
    required: true,
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Paid", "Failed"],
    default: "Pending",
  },
  paymentId: { type: String },
  paymentDate: { type: Date },

  status: {
    type: String,
    enum: ["Placed", "Preparing", "Delivered", "Cancelled"],
    default: "Placed",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = { OrdersSchema };
