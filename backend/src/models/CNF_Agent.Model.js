const mongoose = require("mongoose");

const CNFAgentSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the username"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
      lowercase: true, // Ensures the email is always in lowercase
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Please add the confirm password"],
    },
    mobileNo: {
      type: String,
      required: [true, "Please add the mobile number"],
      unique: true,
      match: [/^\d{10}$/, "Please enter a valid 10-digit mobile number"], // Validates mobile number format
    },
    address: {
      type: String,
      required: [true, "Please add the address"],
    },
    city: {
      type: String,
      required: [true, "Please add the city name"],
    },
    pinCode: {
      type: String,
      required: [true, "Please add the pin code"],
      match: [/^\d{6}$/, "Please enter a valid 6-digit pin code"], // Validates pin code format (Indian pin code format assumed)
    },
    district: {
      type: String,
      required: [true, "Please add the district name"],
    },
    state: {
      type: String,
      required: [true, "Please add the city name"],
    },
    location: {
      type: {
        latitude: {
          type: Number,
          required: [true, "Please add the latitude"],
        },
        longitude: {
          type: Number,
          required: [true, "Please add the longitude"],
        },
      },
    },
    region: { // Added region field
      type: String,
      required: [true, "Please add the region"],
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

// Pre-save middleware to convert email to lowercase before saving
CNFAgentSchema.pre("save", function(next) {
  this.email = this.email.toLowerCase(); // Convert email to lowercase
  next();
});

module.exports = mongoose.model("CNFAgent", CNFAgentSchema);
