const mongoose = require('mongoose');

const message = new mongoose.Schema({

    name:{
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true,
    },
    phoneNo:{
        type: Number,
        required: true,
    },
    message : {
        type: Array,
        required: true,
    },
    userType : {
        type: String,
        enum: ['Individual', 'Organisation'],
        required: true,
    }

})

module.exports = mongoose.model('Message', message);