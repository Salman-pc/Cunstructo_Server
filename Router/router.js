const express = require('express')
const categorcontroller = require('../Controller/categoryController')
const multermiddileware = require('../Middlieware/multerMiddleware')
const addsController = require('../Controller/addsController')
const userController = require('../Controller/userController')
const jwtMiddileware = require('../Middlieware/jwtMiddileware')
const feedbackcontroller=require('../Controller/feedbackController')
const meessageController =require('../Controller/messageController')

const router = express.Router()

//userRegistration
router.post('/userregister',userController.userRegisterController) 
router.post('/userlogin',userController.userLoginController) 
router.get('/get-all-users',userController.getAllusersController) 
router.get('/get-all-workers',userController.getAllworkersController) 
router.get('/getsingleuser',jwtMiddileware,userController.getSingleUserController)
router.delete('/remove-users/:id',userController.deleteuserController) 
router.delete('/deleteaccount',jwtMiddileware,userController.deleteAccountController) 

router.put('/updatepassword',jwtMiddileware,userController.changePasswordController)
router.get(`/categoryselect`,jwtMiddileware,userController.searchUserController)
router.put(`/updateProfile`,jwtMiddileware,multermiddileware.single('profilepic'),userController.updateProfileController)

// userblock
router.put('/updateuserblock/:id',userController.updateBlockController)
router.post('/getblockusers',userController.getAllblokedusersController)


//  category
router.post('/addcategory',multermiddileware.single('categoryimg'),categorcontroller.addCategoryController)
router.get('/getallcategory',categorcontroller.getCategoryController)
router.delete('/deletecategory/:id',categorcontroller.deleteCategory)
router.put('/updatecategory/:id',multermiddileware.single('categoryimg'),categorcontroller.updateCategoryController)


// adds 
router.post('/addAdds',multermiddileware.single('adsimg'),addsController.addsController)
router.get('/getalladds',addsController.getaddsController)
router.delete('/deleteadds/:id',addsController.deleteaddsController)
router.put('/updateadds/:id',multermiddileware.single('adsimg'),addsController.updateaddsController)

// feedbacks
router.post('/feedback',jwtMiddileware,feedbackcontroller.sendFeedbackController)
router.get(`/getallfeedback`,feedbackcontroller.getAllfeedbackController)
router.delete('/deletefeedback/:id',feedbackcontroller.deletefeedbackController)

//messages 

router.get('/getuserforsidebar',jwtMiddileware,meessageController.getWorkersForsidebarController)
router.get('/getusers&workersforsidebar',jwtMiddileware,meessageController.getUsersAndWorkersForsidebarController)
router.get('/getmessage/:id',jwtMiddileware,meessageController.getmessagesController)
router.post('/sendmessage/:id',jwtMiddileware,meessageController.sendmessageController)


module.exports=router
