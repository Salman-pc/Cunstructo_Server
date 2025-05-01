const mongoose = require('mongoose')

const addsSchema = new mongoose.Schema({
    adsname:{
        type:String,
    },
    adsimg:{
        type:String
    }
})

const adds = mongoose.model("adds",addsSchema)
module.exports = adds

