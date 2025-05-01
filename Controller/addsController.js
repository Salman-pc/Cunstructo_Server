const adds = require('../Modal/addsModel')

exports.addsController=async(req,res)=>{
    console.log("inside the addscontroller");

    const {adsname}=req.body
    const adsimg =req.file.filename

    try {

        const exsistingadds=await adds.findOne({adsname})
        if(exsistingadds){
            res.status(406).json("this add allreadey added ")
        }
        else{
            const newadd = new adds({adsname,adsimg})
            await newadd.save()
            res.status(200).json(newadd)
        }
    } catch (error) {
        res.status(401).json(error)
    }
    
}

exports.getaddsController=async(req,res)=>{
    console.log("inside the getaddsController")

    try {
        
        const data = await adds.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(401).json(error)
    }
    
}

exports.deleteaddsController=async(req,res)=>{
    console.log("inside delete adds controller");
    
    const {id}=req.params

    try {
        const deleteadds = await adds.findByIdAndDelete({_id:id})
        res.status(200).json(deleteadds)
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.updateaddsController=async(req,res)=>{
    const {id}=req.params
    const {adsname,adsimg}=req.body
    const uploadimg =req.file?req.file.filename:adsimg

    try {
        const updateads=await adds.findByIdAndUpdate({_id:id},{adsname,adsimg:uploadimg},{new:true})
        await updateads.save()
        res.status(200).json(updateads)
    } catch (error) {
        res.status(401).json(error)
    }
}