const mongoose = require("mongoose");

const showCaseSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "ProductEomm", // Reference to Product model
    },
    fieldManagerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FieldManagerLogin", // Name of the FieldManager model
      default: null,
    },
    FEA_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FieldManagerLogin", // Name of the FieldManager model
      default: null,
    },
    fragrance: [
      {
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
      },
    ],
    tasteAndFlavor: [
      {
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
      },
    ],

    productSimilarity: {
      type: String,
      required: true,
      trim: true,
    },
    locations: [
      {
        longitude: { type: Number, required: true },
        latitude: { type: Number, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    reviews: [
      {
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 10,
        },
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

module.exports = mongoose.model("ShowCase", showCaseSchema);
