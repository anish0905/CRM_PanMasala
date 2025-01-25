const mongoose = require('mongoose');

// Super Stockist Product Schema
const superstockistProductSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Reference to the User model
    },
    productName: {
      type: String,
      required: [true, 'Please add the product name'],
    },
    productDescription: {
      type: String,
      required: [true, 'Please add the product description'],
    },
    flavour: {
      type: String,
      required: [true, 'Please add the product flavor'],
      enum: ['silver flavor', 'gold flavor', 'diamond flavor'],
      default: 'silver flavor',
    },
    productSize: {
      type: String,
      required: [true, 'Please add the product size'],
      enum: ['Sm Bora', 'Medium Bora', 'Big Bora'],
      default: 'Sm Bora',
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price must be a positive number'],
    },
    quantity: {
      type: Number,
      required: [true, 'Please add the product quantity'],
      min: [0, 'Quantity must be at least 0'],
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt
  }
);



module.exports = mongoose.model('SuperStockistProductDetails', superstockistProductSchema);
