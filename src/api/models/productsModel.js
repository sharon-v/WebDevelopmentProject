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
    picture: { //maybe diffrent type
        type: Image,
        required: true,
    },
    discription: {
        type: String,
        required: true,
    },
    quantityCaliforniaKing: {
        type: int,
        required: true,
    },
    quantityKing: {
        type: int,
        required: true,
    },
    quantityQueen: {
        type: int,
        required: true,
    },
    quantityTwin: {
        type: int,
        required: true,
    },
},
    { timestamps: true },
);

module.exports = mongoose.model('Product', productSchema);

