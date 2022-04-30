const mongoose = require('mongoose');
// const { modelName } = require('moongose/models/user_model');
const Article = require('../models/productModel');
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
    },
    price: {
        type: String,
        required: true,
    },
    quantity: {
        type: String,
        required: true,
    },
},
    { timestamps: true },
);

module.exports = mongoose.model('Customer', customerSchema);

