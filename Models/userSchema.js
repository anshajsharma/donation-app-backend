const mongoose = require('mongoose');

const user = new mongoose.Schema({
    userID: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    emailID: {
        type: String,
        required: true,
        unique: true
    },
    contactNumber: {
        type: Number,
        required: true,
        unique: true
    },
    // DOB / DOE
    date: {
        type: Date,
        required: true
    },
    userType: {
        type: String,
        enum: ['Individual', 'Organisation'],
        required: true
    },
    donationsMade: {
        type: Object
    },
    donationsRec: {
        type: Object
    },
    bankDetails: {
        type: Object
    }
})