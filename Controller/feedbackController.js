const feedbacks = require('../Modal/feedbackModel');
const users = require('../Modal/userModel')


exports.sendFeedbackController=async(req,res)=>{
    console.log("inside the sendfeedback controller");
    
    try {
        const {message,date}=req.body
        const userid=req.userid

        console.log(userid);

        const exsistinguser = await users.findById({_id:userid})
        
        
        const feedback =  await feedbacks({userid,username:exsistinguser.username,date,email:exsistinguser.email,message})

        await feedback.save()
        console.log(feedback);
        res.status(200).json({feedback,message:"feedback sucessfully send"})
        

    } catch (error) {
        res.status(401).json(error)
    }
}

exports.getAllfeedbackController=async(req,res)=>{
    console.log("inside the getallFeedbackController");

    try {
        const getfeedback = await feedbacks.find()
        res.status(200).json(getfeedback)
    } catch (error) {
        res.status(401).json(error)
        
    }
    
}

exports.deletefeedbackController=async(req,res)=>{
    console.log("deletefeedback controller");
    
    const {id} =req.params
    try {
        const deletefeedback = await feedbacks.findByIdAndDelete({_id:id})
        
        res.status(200).json(deletefeedback)
        
    } catch (error) {
        res.status(401).json(error)
    }
}
