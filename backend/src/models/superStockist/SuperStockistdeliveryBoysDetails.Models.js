const mongoose = require("mongoose");

const  SuperstockistdeliveryBoysDetailsSchema = mongoose.Schema(
  {
    username: {
      type: "String",
      required: true,
      errorMessage: "Please add the user name",
    },
    email: {
      type: "String",
      required: true,
      unique: true,
      errorMessage: "Please add the user email address",
    },
    password: {
      type: "String",
      required: true,
      errorMessage: "Please add the user password",
    },
    confirmPassword: {
      type: "String",
      errorMessage: "Please add the user confirm password",
    },
    phoneNo: {
      type: "Number",
      required: true,
      errorMessage: "Please add the user phone number",
    },
    address: {
      type: "String",
      required: true,
      errorMessage: "Please add the user address",
    },

    city: {
      type: "String",
      required: true,
      errorMessage: "Please add the user city",
    },
    pinCode: {
      type: "String",
      required: true,
      errorMessage: "Please add the user pinCode",
    },
    state: {
      type: "String",
      required: true,
      errorMessage: "Please add the user state",
    },
    superstockist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SuperStockist",
    },
   
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("SuperstockistdeliveryBoys", SuperstockistdeliveryBoysDetailsSchema);
