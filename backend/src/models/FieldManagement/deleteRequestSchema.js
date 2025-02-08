const mongoose = require("mongoose");

const deleteRequestSchema = new mongoose.Schema({
  fieldManagerId: {
    // Fixed naming inconsistency
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "FieldManagerLogin",
  },
  reason: { type: String, required: true },
  status: {
    type: String,
    enum: ["Pending", "Approved", "Rejected"],
    default: "Pending",
  },
  requestedAt: { type: Date, default: Date.now },
});

const DeleteRequest = mongoose.model("DeleteRequest", deleteRequestSchema);
module.exports = DeleteRequest;
