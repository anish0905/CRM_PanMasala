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
      lowercase: true, // Ensures the email is stored in lowercase
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

// Pre-save hook to ensure email is lowercase
DistributorSchema.pre("save", function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model("Distributor", DistributorSchema);