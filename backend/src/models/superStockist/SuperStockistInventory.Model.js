const mongoose = require('mongoose');

const SuperStockistInventorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperStockist', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductEomm', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'PanShopOrder' },
  productName: { type: String, required: true },
  receivedStock: { type: Number, default: 0 },
  dispatchedStock: { type: Number, default: 0 },
  remainingStock: { type: Number, required: true },
  reviewedDate: { type: Date },
  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Management' },
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Stockists' },
  transactionHistory: [
    {
      issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'stockists' },
      issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Management' },
      quantity: { type: Number, required: true },
      transactionDate: { type: Date, default: Date.now },
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductEomm', required: true },
    },
  ],
}, { timestamps: true });

const SuperStockistInventory = mongoose.model('SuperStockistInventory', SuperStockistInventorySchema);

module.exports = SuperStockistInventory;

