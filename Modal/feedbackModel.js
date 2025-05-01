const { request } = require('express')
const mongoose = require('mongoose')

const feedbackSchema= new mongoose.Schema({
    userid:{
        require:true,
        type:String
    },
    username:{
        require:true,
        type:String,
    },
    email:{
        require:true,
        type:String,
    },
    date:{
        require:true,
        type:String
    },
    message:{
        require:true,
        type:String
    }
})

const feedbacks = mongoose.model("feedbacks",feedbackSchema)
module.exports=feedbacks