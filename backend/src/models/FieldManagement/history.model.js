const mongoose = require('mongoose');

// Define the schema for change history
const historySchema = new mongoose.Schema({
  panShopId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "PanShopOwner" // Reference the PanShopOwner model
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User" // Reference the User model
  },
  changes: [
    {
      field: { type: String, required: true },
      oldValue: { type: mongoose.Schema.Types.Mixed },
      newValue: { type: mongoose.Schema.Types.Mixed }
    }
  ],
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const History = mongoose.model('History', historySchema);

module.exports = History;
 