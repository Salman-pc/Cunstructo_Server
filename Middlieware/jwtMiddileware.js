const jwt = require('jsonwebtoken')

const jwtMiddileware = (req, res, next) => {

    console.log("inside the middile ware");

    const token=req.headers["authorization"].split(' ')[1]

    if(token){

        try {
            const jwtresponse = jwt.verify(token,process.env.jwt_pass)
            console.log(jwtresponse);
            req.userid=jwtresponse.userid
            next()
            
        } catch (error) {
            res.status(401).json("authorization faild ...please login")
        }
    }
    else{
        res.status(404).json("authorization faid token is missing")
    }


}
module.exports=jwtMiddileware