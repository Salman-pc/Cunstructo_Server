const mongoose = require('mongoose')

const categorySchema = new mongoose.Schema({
    categoryname:{
        type:String,
        require:true
    },
    categoryimg:{
        type:String,
        require:true
    }
})

const category = mongoose.model("category",categorySchema)
module.exports = category

