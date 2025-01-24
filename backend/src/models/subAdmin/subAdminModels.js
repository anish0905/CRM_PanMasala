const mongoose = require("mongoose");

const subAdminSchema = mongoose.Schema(
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
    district:{
      type: String,
      required: [true, "Please add the district name"],
    },
    location: {
      type: {
        latitude: {
          type: Number,
          required: [true, "Please add the latitude"]
        },
        longitude: {
          type: Number,
          required: [true, "Please add the longitude"]
        }
      },
     
    }
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);

// Pre-save hook to convert email to lowercase
subAdminSchema.pre("save", function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model("subAdmin", subAdminSchema);
