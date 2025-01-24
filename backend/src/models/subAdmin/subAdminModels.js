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
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please add the user password"],
    },
    confirmPassword: {
      type: String,
      required: [true, "Please add the confirm password"],
    },
  },
  {
    timestamps: true, // Automatically adds `createdAt` and `updatedAt`
  }
);
subAdminSchema.pre("save", function (next) {
  if (this.email) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model("subAdmin", subAdminSchema);
