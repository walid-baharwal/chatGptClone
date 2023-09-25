const express = require('express')
require('./db/config');
const Chats = require('./models/Chats')
const cors = require('cors');


const app = express()
const port = 5000;

app.use(express.json())
app.use(cors());


app.use('/api/auth',require('./routes/auth'))
app.use('/api/chats',require('./routes/chats'))
// app.get('/',async (req, res) =>{
//     let chats = await  Chats.find()
//     chats.length > 0 ? res.send(chats) :res.send({message:"No chats found"})
// })



app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
  })