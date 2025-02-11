const mongoose = require('mongoose');

// Product Schema
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Please add at least one product name'],
    },
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductEomm"
    },
    image: {
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

// Order Schema
const OrderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true,
    },
    products: {
        type: [productSchema],
        required: [true, 'Please add at least one product'],
    },
    totalPrice: {
        type: Number,
        default: 0,
    },
    status: {
        type: String,
        enum: ["pending", "confirmed", "shipping", "delivered", "canceled"],
        default: "pending",
    },
    otp: {
        type: Number,
        default: null,
    },
    deliveryBoyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'deliveryboysdetails',
    },
    distributorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Distributor', // Reference to the Distributor model
    },
    shippingAddress: {
        fullName: { type: String, required: true },
        phoneNumber: { type: String, required: true },
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zipCode: { type: String, required: true },
        country: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number], // [longitude, latitude]
                required: true
            }
        }
    },
    orderId: {
        type: String,
        unique: true,
        required: true,
    }
}, {
    timestamps: true
});

// Middleware to generate unique orderId before saving
OrderSchema.pre('save', async function (next) {
    if (!this.orderId) {
        const randomAlphabets = () => Math.random().toString(36).substring(2, 6).toUpperCase();
        const randomNumbers = () => Math.floor(1000 + Math.random() * 9000);
        this.orderId = `${randomAlphabets()}${randomNumbers()}`;
        console.log(`Generated orderId: ${this.orderId}`);
    }
    next();
});

// Index location for geospatial queries
OrderSchema.index({ "shippingAddress.location": "2dsphere" });

// Function to find the nearest distributor
OrderSchema.statics.findNearestDistributor = async function (longitude, latitude) {
    return await this.model('Distributors').findOne({
        location: {
            $near: {
                $geometry: { type: "Point", coordinates: [longitude, latitude] },
                $maxDistance: 50000 // 50km range
            }
        }
    });
};

const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
module.exports = Order;
