const mongoose = require('mongoose');

const otp = new mongoose.Schema({
    createdAt:{
        type: Date,
    },
    expireAfterSeconds: {
        type: Number,
        default: 120
    },
    email: {
        type: String,
        required: true
    },
    OTP: {
        type: String,
        required: true
    }

})


module.exports = mongoose.model('otp', otp);