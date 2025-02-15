const mongoose = require("mongoose");


// Super Stockist Schema for user registration
const superStockistSchema = new mongoose.Schema(
  {
    cnf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CNFAgent",
      required: true,
    },
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
    mobileNo: {
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
    district: {
      type: String,
      required: [true, "please add the district"],
    },
    address: {
      type: String,
      required: [true, "please add the address"],
    },
    pinCode: {
      type: String,
      required: [true, "please add the pinCode"],
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


superStockistSchema.pre("save", function(next){
  if(this.email){
    this.email = this.email.toLowerCase();
  }
  next();
})

// Export the model with a proper name
module.exports = mongoose.model("SuperStockist", superStockistSchema);
