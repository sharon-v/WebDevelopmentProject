const mongoose = require('mongoose');
const { modelName } = require('moongose/models/user_model');
const userSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true,
    },
    birthDate: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    passward: {
        type: String,
        required: true,
    },
},
    { timestamps: true },
);

module.exports = mongoose.model('User', userSchema);

