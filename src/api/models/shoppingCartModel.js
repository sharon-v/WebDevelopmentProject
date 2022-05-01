const mongoose = require('mongoose');
const Article = require('../models/shoppingCartModel');
const shoppingCartSchema = new mongoose.Schema({
    productID: { //maybe list
        type: String,
        required: true,
    },
    badSize: {
        type: String,
        required: true,
    },
    quantity: {
        type: int,
        required: true,
    },
},
    { timestamps: true },
);

module.exports = mongoose.model('ShoppingCart', shoppingCartSchema);
