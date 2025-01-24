const mongoose = require("mongoose");

const CNFAgentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  address: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  region: {
    type: String,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },

  contact: {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
  },

  timestamp: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("CNFAgent", CNFAgentSchema);
