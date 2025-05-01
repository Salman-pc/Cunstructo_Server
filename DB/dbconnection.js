const mongoose = require('mongoose')

const connection_string = process.env.connection_string

mongoose.connect(connection_string).then(res=>{
    console.log("connection success fully connectd");
    
}).catch(err=>{
    console.log("connecton faild");
    console.log(err);
    
})

