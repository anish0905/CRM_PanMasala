const mongoose = require("mongoose");

const DistributorSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the user name"],
    },

    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
    },
    mobileNo: {
      type: String,
      required: [true, "Please add the user phone number"],
      unique: [true, "Phone number already registered"],
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
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
    district: {
      // Added region field
      type: String,
      required: [true, "Please add the region"],
    },
    city: {
      type: String,
      required: [true, "please add the city "],
    },
    address: {
      type: String,
    },
    pinCode: {
      type: String,
    },
    cnf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CNFAgent",
      required: true,
    },
    superstockist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperStockist",
    },
    resetToken: String,
    resetTokenExpiration: Date,
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Distributor", DistributorSchema);
