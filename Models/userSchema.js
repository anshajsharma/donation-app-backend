const mongoose = require('mongoose');

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName:{
        type: String,
        required: isIndividual,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNo: {
        type: Number,
        required: true,
        unique: true
    },
    // DOB / DOE
    date: {
        type: Date,
        required: true
    },
    state:{
        type: String,
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
    },

    verified:{
      type: Boolean,
    },

    password: {
        type: String,
        required: true
    }


})

function isIndividual (){
    if(this.userType === 'Individual'){
        return true;
    }else{
        return false;
    }
}

module.exports = mongoose.model('user', user);