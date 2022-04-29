const mongoose = require('mongoose');
const { modelName } = require('moongose/models/user_model');
const customerSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        required: true
    },
    birthDate: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
},
    { timestamps: true }
);

module.exports = mongoose.model('Customer', customerSchema);

