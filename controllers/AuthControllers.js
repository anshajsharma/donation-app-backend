const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const validator = require("deep-email-validator");
const OTP = require('../models/otpSchema');

async function isEmailValid(email){
    const isValid = await validator.validate(email);
    return isValid;
}

function mailer (email, otp) {
    let nodemailer = require('nodemailer');
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 587,
        secure: false,
        auth: {
            user: 'donatenowindia@gmail.com',
            pass: 'bpivvgxqpkvduyex'
        }
    });

    let mailOptions = {
        from: 'donatenowindia@gmail.com',
        to: email,
        subject: 'Reset your password',
        text: otp + " Use this OTP to change your password."
    };

    transporter.sendMail(mailOptions, function(error, info){
        if(error){
            console.log(error);
        }else{
            console.log('Email sent');
        }
    });
}

exports.signUp = async (req,res) => {
    let newUser = new User(req.body);
    const {valid, reason, validators} = await isEmailValid(req.body.email);
    if(valid){
        // if(validPhone)
        // {
            newUser.save()
                .then((doc)=>{
                    res.status(200).send({msg: "Account Successfully Created !"})
                })
                .catch((err)=>{
                    if(err.message.includes("email")){
                        res.status(200).send({msg: "Error: Email already registered !", errMsg: err.message})
                    }else if(err.message.includes("phoneNo")){
                        res.status(200).send({msg: "Error: Phone Number already registered !", errMsg: err.message})
                    }
                })
        // }
        // else{
        //     res.send({
        //         message: "Invalid Phone No",
        //     });
        // }
    }
    else{
        res.send({
            message: "Invalid Email ID",
            reason: validators[reason].reason
        });
    }
}

exports.login = async (req,res) => {
    const {valid, reason, validators} = await isEmailValid(req.body.email);
    if(valid){
        User.findOne({email: req.body.email}, (err,doc)=>{
            if(err){
                res.status(200).send({msg: "Login failed !", errMsg: err.message})
            }else{
                if(doc){
                    bcrypt.compare(req.body.password, doc.password, function(err, isMatch) {
                        if (!isMatch) {
                            res.status(200).send({msg: "Login failed !", errMsg: "Invalid password"})
                        } else {
                            if(doc.userType === req.body.userType){
                                const token = jwt.sign({_id: doc._id}, process.env.SECRET_KEY);
                                res.status(200).send({msg: "Successfully Logged In !", token: token})
                            }else{
                                res.status(200).send({msg: "Login failed !", errMsg: "No matching profile found"})
                            }
                        }   
                    })
                }else{
                    res.status(200).send({msg: "Login failed !", errMsg: "User not found !"})
                }   
            }
        })
    }
    else{
        res.send({
            message: "Invalid Email ID",
            reason: validators[reason].reason
        });
    }
}

exports.emailSend = async (req,res) => {
    const {valid, reason, validators} = await isEmailValid(req.body.email);
    if(valid){
        OTP.findOne({email: req.body.email},(err,doc)=>{
            if(err){
                res.send({msg: "Failed !", errMsg: err.message})
            }else{
                if(doc){
                    OTP.deleteMany({email: doc.email}, (err,obj)=>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
            }
        })
        User.findOne({email: req.body.email},(err,doc)=>{
            if(err){
                res.send({msg: "Failed !", errMsg: err.message})
            }else{
                if(doc){
                    let otpCode = Math.floor(1000 + Math.random() * 9000);
                    let otpData = new OTP({
                        email: req.body.email,
                        OTP: otpCode,
                        expireIn: new Date().getTime()// + 300*1000
                    })
                    otpData.save()
                        .then((doc)=>{
                            mailer(req.body.email, otpCode);
                            res.send({msg: "OTP sent successfully. Check Your Mailbox."})
                        })
                        .catch((err)=>{
                            res.status(200).send({msg: "Failed !", errMsg: err.message})
                })
                }else{
                    res.send({msg: "Email not registered !"})
                }
            }
        })
    }
    else{
        res.send({
            message: "Invalid Email ID",
            reason: validators[reason].reason
        });
    }
}

exports.changePassword = async (req,res) => {
    const {valid, reason, validators} = await isEmailValid(req.body.email);
    if(valid){
        let data = await OTP.findOne({email: req.body.email, OTP: req.body.OTP});
        if(data){
            let currentTime = new Date().getTime();
            let diff = data.expireIn - currentTime;
            if(diff <= 0){
                res.json({msg: "OTP Expired !"});
            }else{
                let salt = await bcrypt.genSalt();
                let hashedString = await bcrypt.hash(req.body.password, salt);
                User.updateOne({email: req.body.email}, {$set: {password: hashedString}},(err,doc)=>{
                    if(err){
                        res.send({msg: "Password Updation Failed !.", errMsg: err.message})
                    
                    }else{
                        res.send({msg: "Password Updated !"})
                    }
                })
            }
            OTP.deleteMany({email: data.email}, (err,obj)=>{
                if(err){
                    console.log(err);
                }
            })
        }else{
            res.json({msg: "Invalid OTP"});
        }
    }else{
        res.send({
            message: "Invalid Email ID",
            reason: validators[reason].reason
        });
    }
}