const messages = require('../Modal/messageModel')
const users = require('../Modal/userModel');
const { getReceverSocketId , getIO} = require('../Socket io/socketio');

exports.getWorkersForsidebarController = async (req, res) => {

    console.log("inside the getuser for side bar controller");

    try {

        const userid = req.userid
        const filterduser = await users.find({ _id: { $ne: userid } ,roll:"worker"})
        res.status(200).json(filterduser)
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.getUsersAndWorkersForsidebarController = async (req, res) => {

    console.log("inside the getuser for side bar controller");

    try {

        const userid = req.userid
        const filterduser = await users.find({ _id: { $ne: userid },roll:{ $ne: "admin" }})
        res.status(200).json(filterduser)
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.getmessagesController = async (req, res) => {
    console.log("inside the getmessage controller");
    try {
        const { id:usertoChatid } = req.params
        const myid = req.userid;

        const message = await messages.find({
            $or: [
                { senderId: myid, receiverId: usertoChatid },
                { senderId: usertoChatid, receiverId: myid }
            ]
        })
           
        res.status(200).json(message)
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.sendmessageController=async(req,res)=>{
    console.log("inside the sendmessage controller");
    
    try {
        const {text}=req.body
        const {id:receiverId}=req.params
        const senderId = req.userid

        const newMessage= new messages({
            senderId,
            receiverId,
            text
        })
        await newMessage.save()
        const io = getIO()
        const reciverSocketId = getReceverSocketId(receiverId)
        if(reciverSocketId){
            io.to(reciverSocketId).emit("newMessage",newMessage)
        }
        res.status(200).json(newMessage)
    } catch (error) {
        res.status(401).json(error)
    }
}