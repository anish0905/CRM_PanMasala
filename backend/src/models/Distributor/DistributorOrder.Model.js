const mongoose = require("mongoose");

// Product Sub-Schema
const productSchema = new mongoose.Schema({
  productNames: {
    type: String, // Array of product names
    required: [true, "Please add at least one product name"],
  },

  productSize: {
    type: String,
    required: [true, "Please add the product size"],
    enum: ["Sm Bora", "Medium Bora", "Big Bora"],
    default: "Sm Bora",
  },
  quantity: {
    type: Number,
    required: [true, "Please add the product quantity"],
    min: [0, "Quantity must be at least 0"],
  },
});
const DistributorOrderSchema = new mongoose.Schema(
  {
    products: [productSchema], // Array of product objects

    status: {
      type: String,
      enum: ["pending", "confirmed", "shipped", "delivered"],
      default: "pending",
    },
    username: {
      type: String,
      required: true, // Making it required to ensure there's a username
    },
    email: {
      type: String,
      required: true, // Making it required to ensure there's an email
    },
    date: {
      type: String,
      default: "",
    },
    time: {
      type: String,
      default: "",
    },
    superstockistEmail: {
      type: String,
      required: true, // Making it required to ensure there's a superstockist email
    },
    message: {
      type: String,
      default: "",
    },
    stockistMessage: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model("DistributorOrder", DistributorOrderSchema);
