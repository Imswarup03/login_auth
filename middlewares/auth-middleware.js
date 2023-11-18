import jwt from 'jsonwebtoken';
import UserModel from "../models/user.js";

var checkUserAuth =async(req,res,next)=>{
    let token 
    const {authorization} = req.headers
    console.log("heders",req.headers)
    if (authorization && authorization.startsWith('Bearer')){
        try{
            //get token from header
            token = authorization.split(' ')[1].trim()
            console.log("token===",token)

            //verify token 
            const {userId}=jwt.verify(token,process.env.JWT_SECRET_KEY)
            
            console.log("userId===",userId)


            //Get user from token
            req.user= await UserModel.findById(userId).select('-password')
            // it will select the user except password
            next()

        }
        catch(error){

            console.log(error)
            res.status(401).send({"Status":"Failed","Message":"Please login to access this resource","statusCode":401})
        }
    }
    if(!token){
        res.status(401).send({"Status":"Failed","Message":"No token provided","statusCode":401})
    }
}

export default checkUserAuth