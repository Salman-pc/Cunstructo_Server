require('dotenv').config()
const express = require('express')
const http = require("http");
const cors = require('cors')
const router = require('./Router/router')
const {socketHandler} = require("./Socket io/socketio");
require('./DB/dbconnection')


const constructoServer = express()
constructoServer.use(cors())
constructoServer.use(express.json())
constructoServer.use(router)
constructoServer.use('/uploads',express.static('./uploads'))

const server = http.createServer(constructoServer);
socketHandler(server);

const PORT = 3000 || process.env.PORT

server.listen(PORT, () => {
    console.log(`✅ Server + Socket.IO running on http://localhost:${PORT}`);
})

// constructoServer.listen(PORT,()=>{
//     console.log(`the server running ${PORT}`);
    
// })
constructoServer.get('/',(req,res)=>{
    res.status(200).send("the server is running")
})