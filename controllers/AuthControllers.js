const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');


exports.signUp = (req,res) => {
    // console.log(req.body);
    let newUser = new User(req.body);

    newUser.save()
        .then((doc)=>{
            // console.log(doc)
            res.status(200).send({msg: "User created successfully......"})
        })
        .catch((err)=>{
    
            res.status(200).send({msg: "User creation failed......", errMsg: err.message})
        })

}

exports.login = (req,res) => {
    // console.log(req.body);
    User.findOne({email: req.body.email},(err,doc)=>{
        if(err){
            res.status(200).send({msg: "Login failed......", errMsg: err.message})
        }else{
            if(doc){
                if(doc.password === req.body.password && doc.userType === req.body.userType){
                    const token = jwt.sign({_id: doc._id}, process.env.SECRET_KEY);
                    res.status(200).send({msg: "Login successful......", token: token})
                }else{
                    if(doc.password !== req.body.password)
                    res.status(200).send({msg: "Login failed......", errMsg: "Invalid password"})
                    else{
                        res.status(200).send({msg: "Login failed......", errMsg: "Invalid user type"})
                    }
                }
            }else{
                res.status(200).send({msg: "Login failed......", errMsg: "Invalid emailID"})
            }
        }
    })
}