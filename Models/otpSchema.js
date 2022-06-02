const mongoose = require('mongoose');

const otp = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    OTP: {
        type: String,
        required: true
    },
    expireIn: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('otp', otp);