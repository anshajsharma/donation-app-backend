const mongoose = require('mongoose');

const deletedPost = new mongoose.Schema({
    postID: {
        type: String,
        required: true,
        unique: true
    },
    userID: {
        type: String,
        required: true,
        unique: true
    },
    datePosted: {
        type: Date,
        required: true
    },
    dateDeleted: {
        type: Date,
        required: true
    },
    isVerified: {
        type: Boolean,
        required: true
    },
    postTitle: {
        type: String,
        requierd: true
    },
    postContent: {
        type: String,
    },
    amountRequired: {
        type: Number,
        required: true
    },
    amountCollected: {
        type: Number,
        required: true
    }
})