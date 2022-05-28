const mongoose = require('mongoose');

const transaction = new mongoose.Schema({
    userID: {
        type: String,
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
    anon: {
        type: Boolean,
        required: true
    },
    postID: {
        type: String,
        required: true,
        unique: true
    },
    amount: {
        type: Number,
        required: true
    },
    reciever: {
        type: Object,
        required: true
    },
    transactionID: {
        type: String,
        required: true
    },
    transactionDate: {
        type: Date,
        required: true
    },
    transactionMethod: {
        type: String,
        enum: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking'],
        required: true
    },
    transactionStatus: {
        type: String,
        enum: ['Failed', 'Successful']
    }
})