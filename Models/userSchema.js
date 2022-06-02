const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const user = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    lastName: {
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
      default: false
    },
    password: {
        type: String,
        required: true
    }
})

user.pre('save', async function (){
    let salt = await bcrypt.genSalt();
    let hashedString = await bcrypt.hash(this.password, salt);
    this.password = hashedString;

    let str = this.name;
    let str2 = str.charAt(0).toUpperCase() + str.slice(1);
    this.name = str2;

    if(this.lastName){
        str = this.lastName;
        str2 = str.charAt(0).toUpperCase() + str.slice(1);
        this.lastName = str2;
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