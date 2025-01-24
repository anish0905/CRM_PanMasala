const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  FieldManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "FieldManagerLogin",
  },
  locations: [
    {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const Location = mongoose.model("FieldManagerLocation", locationSchema);

module.exports = Location;
