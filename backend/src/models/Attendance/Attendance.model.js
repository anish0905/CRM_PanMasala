const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    ispresent: {
      type: Boolean,
      required: true,
    },
    logintime: {
      type: Date,
    },

    logouttime: {
      type: Date,
    },
    loginLocation: {
      latitude: {
        type: Number,
        required: false,
        default: null,
      },
      longitude: {
        type: Number,
        required: false,
        default: null,
      },
    },
    logoutLocation: {
      latitude: {
        type: Number,
        required: false,
        default: null,
      },
      longitude: {
        type: Number,
        required: false,
        default: null,
      },
    },
    loginImg: {
      type: String,
    },
    logoutImg: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: [
        "FEA",
        "SuperStockist",
        "subAdmin",
        "CNF",
        "distributor",
        "admin",
        "fieldExecutive",
      ],
      default: "FEA",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Attendance", attendanceSchema);
