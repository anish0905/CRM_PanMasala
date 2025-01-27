const mongoose = require('mongoose');

// Schema for individual products
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Please add at least one product name'],
    },
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"ProductEomm"
       
    },
    image:{
        type: String,
       
    },

    quantity: {
        type: Number,
        required: [true, 'Please add the product quantity'],
        min: [0, 'Quantity must be at least 0'],
    },
    price: {
        type: Number,
        required: [true, 'Please add the product price'],
        min: [0, 'Price must be at least 0'],
    },
    
});

// Main order schema
const PanShopOrderSchema = new mongoose.Schema({
    products: {
        type: [productSchema],
        required: [true, 'Please add at least one product'],
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
    superStockistEmail: {
        type: String,
    },
    stockistEmail: {
        type: String,
    },
    panShopOwner_id: {
        type: mongoose.Schema.Types.ObjectId, // Change to ObjectId if referencing a user
        ref: 'PanShopOwner', // Assuming you have a User model
        required: [true, 'Pan Shop Owner ID is required'],
    },
    panShopOwnerName: {
        type: String,
        default: '',
        trim: true,
    },
    panShopOwnerstate: {
        type: String,
        default: '',
        trim: true,
    },
    panShopOwneraddress: {
        type: String,
        default: '',
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "processing", "confirmed", "delivered", "canceled"],
        default: "pending",
    },
    superStockistStatus:{
        type: String,
        enum: ["pending", "delivered", "canceled"],
        default: "pending",
    },
    stockistStatus:{
        type: String,
        enum: ["pending", "confirmed", "shipped", "delivered"],
        default: "pending"
    },
    deliveryBoyOrderStatus:{
        type: String,
        enum: ["pending", "delivered", "canceled"],
        default: "pending",
    },
    otp: {
        type: Number,
        default: null, // Set default to null instead of an empty string
    },
    stockistOtp:{
        type: Number,
        default: null, // Set default to null instead of an empty string
    },
    deliveryBoyId: {
        type: mongoose.Schema.Types.ObjectId, // ObjectId reference to a User model
        ref: 'deliveryboysdetails',
    },
    superStockistdeliveryBoyId: {
        type: mongoose.Schema.Types.ObjectId, // ObjectId reference to a User model
        ref: 'SuperstockistdeliveryBoys',
    },
    superStockistdeliveryBoyOrderStatus: { 
        type: String,
        enum: ["pending", "delivered", "canceled"],
        default: "pending",
    },
    superStockistdeliveryTime:{
        type: String,
        default: '', // Consider changing to Date if applicable
    },
    deliveryTime: {
        type: String,
        default: '', // Consider changing to Date if applicable
    },
    orderId: {
        type: String,
        unique: true, // Ensures the orderId is unique
        required: true, // Makes this field mandatory
    }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

// Middleware to generate unique orderId before saving
PanShopOrderSchema.pre('save', async function(next) {
    if (!this.orderId) {
        const randomAlphabets = () => Math.random().toString(36).substring(2, 6).toUpperCase();
        const randomNumbers = () => Math.floor(1000 + Math.random() * 9000);
        this.orderId = `${randomAlphabets()}${randomNumbers()}`;
        console.log(`Generated orderId: ${this.orderId}`); // Debug log
    }
    next();
});


module.exports = mongoose.model('PanShopOrder', PanShopOrderSchema);


// Model creation
const PanShopOrder = mongoose.models.PanShopOrder || mongoose.model('PanShopOrder', PanShopOrderSchema);

module.exports = PanShopOrder;
