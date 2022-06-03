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
                    res.status(200).send({msg: "Account Successfully Created! Sucess"})
                })
                .catch((err)=>{
                    if(err.message.includes("email")){
                        res.status(200).send({msg: "Email already registered !", errMsg: err.message})
                    }else if(err.message.includes("phoneNo")){
                        res.status(200).send({msg: "Phone Number already registered !", errMsg: err.message})
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
            msg: "Invalid Email ID",
            errMsg: validators[reason].reason
        });
    }
}

exports.login = async (req,res) => {
        User.findOne({email: req.body.email}, (err,doc)=>{
            if(err){
                res.status(200).send({msg: "Login failed !", errMsg: err.message})
            }else{
                if(doc){
                    bcrypt.compare(req.body.password, doc.password, function(err, isMatch) {
                        if (!isMatch) {
                            res.status(200).send({msg: "Password not matched !"})
                        } else {
                            if(doc.userType === req.body.userType){
                                const token = jwt.sign({_id: doc._id}, process.env.SECRET_KEY);
                                res.status(200).send({msg: "Login successful...... Sucess", token: token})
                            }else{
                                res.status(200).send({msg: "Invalid User Type"})
                            }
                        }   
                    })
                }else{
                    res.status(200).send({msg: "Email not registered"})
                }   
            }
        })
    
}

exports.emailSend = async (req,res) => {

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

    User.findOne({email: req.body.email}, (err,doc)=>{
        if(err){
            res.send({msg: "Failed !", errMsg: err.message})
        }else{
            if(doc){
                let otp =  Math.floor(1000 + Math.random() * 9000);
                let newOTP = new OTP({
                    createdAt: new Date(),
                    email: doc.email,
                    OTP: otp
                });
                newOTP.save()
                    .then((doc)=>{
                        mailer(doc.email, otp);
                        res.send({msg: "OTP sent to your email ! Sucess"})
                    })
                    .catch((err)=>{
                        res.send({msg: "OTP sending failed !", errMsg: err.message})
                    })
            }else{
                res.send({msg: "Email not registered"})
            }
        }
    })
    
}
        

exports.changePassword = async (req,res) => {

        let data = await OTP.findOne({email: req.body.email});
        if(data){
            // console.log(data);
            if(data.OTP === req.body.OTP)
            {
                let salt = await bcrypt.genSalt();
                let hashedString = await bcrypt.hash(req.body.password, salt);
                User.updateOne({email: req.body.email}, {$set: {password: hashedString}},(err,doc)=>{
                    if(err){
                        res.send({msg: "Password Updation Failed !.", errMsg: err.message})
                    
                    }else{
                        res.send({msg: "Password Updated ! Sucess"})
                    }
                 })
                
            }
            else
            {
                res.send({msg: "OTP not matched !"});
            }
        }
        else{
            res.send({msg: "OTP expired !"});
        }
}