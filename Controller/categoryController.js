const category = require('../Modal/categoryModel')

exports.addCategoryController=async(req,res)=>{
    console.log("inside the add category controller");

    const {categoryname}=req.body
    const categoryimg =req.file.filename

    try {

        const exsistingcatogory=await category.findOne({categoryname})
        if(exsistingcatogory){
            res.status(406).json("category allreadey added ")
        }
        else{
            const newcategory = new category({categoryname,categoryimg})
            await newcategory.save()
            res.status(200).json(newcategory)
        }
    } catch (error) {
        res.status(401).json(error)
    }
    
}

exports.getCategoryController=async(req,res)=>{
    console.log("inside the getCategoryController")

    try {
        
        const data = await category.find()
        res.status(200).json(data)
    } catch (error) {
        res.status(401).json(error)
    }
    
}

exports.deleteCategory=async(req,res)=>{
    const {id}=req.params

    try {
        const deletecategory = await category.findByIdAndDelete({_id:id})
        res.status(200).json(deletecategory)
    } catch (error) {
        res.status(401).json(error)
    }
}

exports.updateCategoryController=async(req,res)=>{
    const {id}=req.params

    const {categoryname,categoryimg}=req.body
    const uploadimg =req.file?req.file.filename:categoryimg

    try {

        const updatecategory=await category.findByIdAndUpdate({_id:id},{categoryname,categoryimg:uploadimg},{new:true})

        await updatecategory.save()
        res.status(200).json(updatecategory)
    } catch (error) {
        res.status(401).json(error)
    }
}

