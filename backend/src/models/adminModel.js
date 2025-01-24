const mongoose = require("mongoose");

const adminSchema = mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Please add the username"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email address"],
      unique: [true, "Email address already taken"],
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
    timestamps: true, 
  }
);

// Pre-save hook to convert email to lowercase
adminSchema.pre('save', function(next) {
  if (this.isModified('email') || this.isNew) {
    this.email = this.email.toLowerCase();
  }
  next();
});

module.exports = mongoose.model("admin", adminSchema);
