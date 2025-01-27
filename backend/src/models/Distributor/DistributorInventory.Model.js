const mongoose = require('mongoose');

const DistributorInventory = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Distributors', required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductEomm', required: true }, 
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'PanShopOrder' }, 
  productName: { type: String, required: true },
  receivedStock: { type: Number, default: 0 }, 
  dispatchedStock: { type: Number, default: 0 }, 
  remainingStock: { type: Number, required: true }, 
  reviewedDate: { type: Date }, // Last reviewed date
   
  receivedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'vendorRegisterShop' }, 
  transactionHistory: [
    
    {  issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperDistributor' },
      issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'vendorRegisterShop' }, 
      quantity: { type: Number, required: true }, 
      transactionDate: { type: Date, default: Date.now }, 
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductEomm', required: true }, 
    }
  ],
}, { timestamps: true});

const Inventory = mongoose.model('DistributorInventory', DistributorInventory);

module.exports = Inventory;
