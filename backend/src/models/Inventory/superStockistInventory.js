const mongoose = require('mongoose');

const SuperStockistInventorySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperStockist', required: true },
    initialStock: { type: Number, default: 0 },
    dispatchedStock: { type: Number, default: 0 },
    remainingStock: { type: Number, required: true },
    transactionHistory: [
      {
        issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperStockist' },
        issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperStockist' || 'Distributor' },
        transactionDate: { type: Date, default: Date.now },
        status: {
          type: String,
          enum: ['issued', 'dispatched', 'received'],
          default: 'issued',
        },
        Otp: {
          type: String,
          required: true,
          unique: true,
          validate: {
            validator: function (value) {
              return /^[0-9]{6}$/.test(value);
            },
            message: 'Otp must be exactly 6 digits long.',
          },
        },
        products: [
          {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductEomm', required: true },
            productName: { type: String, required: true },
            quantity: { type: Number, required: true },
          },
        ],
        receivedDate: { type: Date },
        OrderId: {
          type: String,
          required: true,
          unique: true,
          validate: {
            validator: function (value) {
              return /^[a-zA-Z0-9]{12}$/.test(value);
            },
            message: 'OrderId must be exactly 12 characters long and contain only alphanumeric characters.',
          },
        },
        
      },
    ],
    revisedStockHistory: [
      {
        revisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'SuperStockist' , required: true },
        revisedFrom: {
          type: String,
          enum: ['CNF', 'SuperStockist'],
          required: true,
        },
        revisedDate: { type: Date, default: Date.now },
        previousStock: { type: Number, required: true },
        newStock: { type: Number, required: true },
       
        products: [
          {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductEomm', required: true },
            productName: { type: String, required: true },
            quantity: { type: Number, required: true },
          },
        ],
      },
      
    ],
  },
  { timestamps: true }
);

const SuperStockistInventory = mongoose.model('SuperStockistInventory', SuperStockistInventorySchema);

module.exports = SuperStockistInventory;
