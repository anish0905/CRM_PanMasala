const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const LoginSchema = new mongoose.Schema(
  {
    distributors_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Distributor",
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => {
          const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return regex.test(email);
        },
        message: "Please enter a valid email address.",
      },
      set: (email) => email.toLowerCase(), // Ensures email is saved in lowercase
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    phoneNo: {
      type: "Number",
      required: true,
      minlength: 10,
      maxlength: 10,
      unique: true,
    },
    role: {
      type: String,
      enum: ["fieldExecutive", "fea"],
      default: "fieldExecutive",
    },
    address: {
      type: String,
      required: true,
      maxlength: 200,
    },
    state: {
      type: String,
      required: true,
      enum: [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
      ],
    },
    pincode: {
      type: String,
      required: true,
      minlength: 6,
      maxlength: 6,
    },
    status: {
      type: String,

      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },

    FEA_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FieldManagerLogin",
    },
  },
  { timestamps: true }
);

// Middleware to hash the password before saving
LoginSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Method to compare passwords
LoginSchema.methods.comparePassword = function (plainPassword) {
  return bcrypt.compare(plainPassword, this.password);
};

module.exports = mongoose.model("FieldManagerLogin", LoginSchema);
