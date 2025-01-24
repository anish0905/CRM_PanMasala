const mongoose = require("mongoose");

const vendorNotRegisterSchema = new mongoose.Schema({
  fieldManagerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FieldManagerLogin",
    required: false,
    default: null,
  },
  FEA_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "FieldManagerLogin", 
        default: null,
      },
  shopName: {
    type: String,
  },
  ownerName: {
    type: String,
    required: true,
  },
  contactNumber: {
    type: String,
    required: true,
  },
  reasonForNotRegistering: {
    type: String,
    enum: [
      "unknown_brand",
      "not_applicable_product",
      "need_more_time",
      "too_expensive",
      "other",
    ],
    default: null,
  },
  otherReasonDetails: {
    type: String,
    required: function () {
      return this.reasonForNotRegistering === "other";
    },
  },
  vendorNotIntrested_Location: [
    {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
      timestamp: { type: Date, default: Date.now },
    },
  ],
   showCaseTestId: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "ShowCase", 
          required: false,
          default: null,
        },
      ],
});

const VendorNotRegister = mongoose.model(
  "VendorNotRegister",
  vendorNotRegisterSchema
);

module.exports = VendorNotRegister;
