const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')


exports.signUp = (req,res) => {
    // console.log(req.body);
    let newUser = new User(req.body);

    newUser.save()
        .then((doc)=>{
            // console.log(doc)
            res.status(200).send({msg: "User created successfully......"})
        })
        .catch((err)=>{
            if(err.message.includes("email")){
                res.status(200).send({msg: "Email already registered !", errMsg: err.message})
            }else if(err.message.includes("phoneNo")){
                res.status(200).send({msg: "Phone Number already registered !", errMsg: err.message})
            }
            
        })

}

exports.login = (req,res) => {
    User.findOne({email: req.body.email},(err,doc)=>{
        if(err){
            res.status(200).send({msg: "Login failed......", errMsg: err.message})
        }else{
            if(doc){

                bcrypt.compare(req.body.password, doc.password, function(err, isMatch) {
                    if (!isMatch) {
                        res.status(200).send({msg: "Login failed......", errMsg: "Invalid password"})
                    } else {
                        if(doc.userType === req.body.userType){
                            const token = jwt.sign({_id: doc._id}, process.env.SECRET_KEY);
                            res.status(200).send({msg: "Login successful......", token: token})
                        }else{
                            res.status(200).send({msg: "Login failed......", errMsg: "Invalid user type"})
                        }
                    }   
                })
            }else{
                res.status(200).send({msg: "Login failed......", errMsg: "Invalid emailID"})
            }
        }
    })
}