const mongoose = require('mongoose');
const Article = require('../models/wishListModel');
const wishListSchema = new mongoose.Schema({
    productID: { //maybe list
        type: String,
        required: true,
    },
    email: { // maybe not needed
        type: String,
        required: true,
    },
},
    { timestamps: true },
);

module.exports = mongoose.model('WishList', wishListSchema);
