const mongoose = require('mongoose');
const Article = require('../models/ordersModel');
const ordersSchema = new mongoose.Schema({
    productID: { //maybe list
        type: String,
        required: true,
    },
    price: { 
        type: double,
        required: true,
    },
    picture: { // maybe diffrent type
        type: Image,
        required: true,
    },
    discription: {
        type: String,
        required: true,
    },
    quantity: {
        type: int,
        required: true,
    },// mybr add total price and total items
},
    { timestamps: true },
);

module.exports = mongoose.model('Orders', ordersSchema);
