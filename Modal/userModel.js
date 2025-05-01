const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    block:{
        type:Boolean,
        default:false
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    profilepic: {
        type: String
    },
    dob: {
        type: String
    },
    gender: {
        type: String,
    },
    aadhar: {
        type: String,
        required: function () { return this.roll === "worker"; } // Use function()
    },
    mobileno: {
        type: String,
        required: function () { return this.roll === "worker"; } // Use function()
    },
    location: {
        type: String,
        required: function () { return this.roll === "worker"; } // Use function()
    },
    status: {
        type: String,
        default: "available",
        required: function () { return this.roll === "worker"; } // Use function()
    },
    experience: {
        type: String,
        
    },
    skills: {
        type: [String],
        required: function () { return this.roll === "worker"; } // Use function()
    },
    roll: {
        type: String,
        required: true,
        default: "user",
        enum: ["user", "worker"]
    }
});

const users = mongoose.model("users", userSchema);

module.exports = users;
