const message = require('../models/contactSchema')


const getmessage = (email,mess) => {
    message.find({email: email},(err,doc)=>{
        if(err){
            console.log(err,"err");
            return err;
        }else{
            console.log(doc,"doc");
            return doc;
        }
    })

}



exports.sendmessage = (req,res) => {
    // console.log(req.body);
    let newmessage = new message(req.body);

    newmessage.save()
        .then((doc)=>{
            // console.log(doc)
            res.status(200).send({msg: "message sent successfully......"})
        })
        .catch(async(err)=>{

            if(err.message.includes("dup"))
            {
                const email = req.body.email;
                const mess = req.body.message;

                message.updateOne({email: email},{$push: {message: mess}},(err,doc)=>{
                    if(err){
                        res.status(200).send({msg: "Message update failed......", errMsg: err.message})
                        
                    }else{
                        res.status(200).send({msg: "Message updated successfully......"})
                    }
                })

            }
            else
            res.status(200).send({msg: "Message sent failed......", errMsg: err.message})
        })

}

