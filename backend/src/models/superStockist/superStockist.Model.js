const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Super Stockist Schema for user registration
const superStockistSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user name"],
      minlength: 3,
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
      lowercase: true,
      match: [/.+@.+\..+/, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
    phoneNo: {
      type: String,
      required: [true, "Please add the user phone number"],
      unique: [true, "Phone number already registered"],
    },
    country: {
      type: String,
      required: true,
      enum: ["India"],
      default: "India",
    },
    state: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: [true, "please add the city"],
    },
    address: {
      type: String,
      required: [true, "please add the address"],
    },
    pinCode: {
      type: String,
      required: [true, "please add the pinCode"],
    },
    wareHouseName: {
      type: String,
      required: [true, "please add the wareHouseName"],
    },
    locations: {
      longitude: { type: Number },
      latitude: { type: Number },
      timestamp: { type: Date, default: Date.now },
    },

    resetToken: String,
    resetTokenExpiration: Date,
  },
  {
    timestamps: true,
  }
);

// Export the model with a proper name
module.exports = mongoose.model("SuperStockist", superStockistSchema);
