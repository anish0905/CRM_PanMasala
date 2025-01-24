const mongoose = require('mongoose');

const productEommSchema = new mongoose.Schema({
    image: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inActive"],
        default: "active" // This should work fine as long as it's defined correctly
    }
});

const ProductEomm = mongoose.model('ProductEomm', productEommSchema);
module.exports = ProductEomm;
