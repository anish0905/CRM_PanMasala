const mongoose = require('mongoose');

const SubAdminInventorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'subAdmin', required: true },
  initialStock: { type: Number, default: 0 },
  dispatchedStock: { type: Number, default: 0 },
  remainingStock: { type: Number, required: true },
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductEomm', required: true },
      
      quantity: { type: Number, required: true },
    }
  ],
  revisedStockHistory: [
    {
      revisedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'admin', required: true },
      revisedDate: { type: Date, default: Date.now },
      products: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductEomm', required: true },
          
          previousStock: { type: Number, required: true },
          newStock: { type: Number, required: true },
          quantityAdded: { type: Number, required: true },
        }
      ]
    }
  ],

  dispatchedStockHistory: [
    {
      issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'CNFAgent', required: true },
      issuedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'subAdmin', required: true },
      transactionDate: { type: Date, default: Date.now },
      products: [
        {
          productId: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductEomm', required: true },
          
          quantityDispatched: { type: Number, required: true },
        }
      ],
      status: {
        type: String,
        enum: ['issued', 'dispatched', 'received'],
        default: 'issued',
      },
      otp: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function (value) {
            return /^[0-9]{6}$/.test(value);
          },
          message: 'OTP must be exactly 6 digits long.',
        },
      },
      receivedDate: { type: Date },
      orderId: {
        type: String,
        required: true,
        unique: true,
        validate: {
          validator: function (value) {
            return /^[a-zA-Z0-9]{12}$/.test(value);
          },
          message: 'Order ID must be exactly 12 characters long and contain only alphanumeric characters.',
        },
      },
    }
  ]
}, { timestamps: true });

const SubAdminInventory = mongoose.model('SubAdminInventory', SubAdminInventorySchema);
module.exports = SubAdminInventory;
