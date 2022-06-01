const express = require('express')
const app = express()
const cors = require('cors')

const mongoose = require('mongoose');
require('dotenv').config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


mongoose.connect(
    process.env.MONGO_URI,
)
.then(result => {
    const port = 3000;
    app.listen(port, () => {
        console.log('Server Started at port '+ port)
    })
}).catch(err => {
    console.log(err);
})


app.get('/', (req, res) => {
  res.send('Hello World!')
})

// Auth
const {signUp,login} = require('./controllers/AuthControllers')

//SignUp
app.post('/signup',signUp);

//Login
app.post('/login',login);

// Message
const {sendmessage} = require('./controllers/messageController')
app.post('/message',sendmessage);

// app.listen('3000',()=>{
//     console.log('Server started at port 3000');
// })