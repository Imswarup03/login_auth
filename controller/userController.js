import model from "../models/user.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import UserModel from "../models/user.js";
import transporter  from "../config/email_config.js";


class UserController{
    static userRegistration = async(req,res)=>{
        const {name,email,password,password_confirmation,tc}=req.body;
        console.log("request",req.body)
        if (name && email && password && password_confirmation && tc){
            console.log(name,email,password,password_confirmation,tc)
            const user = await UserModel.findOne({email:email});
            console.log("user",user)
            if (user){
                res.status(400).send({"Status":"Failed","Message":"User alerady exists"})
            }
            else{
                console.log("password",password,password_confirmation,tc)
                if (password !== password_confirmation){
                    res.status(400).send({"Status":"Failed","Message":"password and confirm password does not match","statusCode":400})
                }
                else{
                    try{
                        if (tc==="true" || tc===true){
                            const salt = await bcrypt.genSalt(10);
                            const hashPassword = await bcrypt.hash(password,salt);
                            const doc = UserModel({
                                name:name,
                                email:email,
                                password:hashPassword,
                                tc:tc
                            })
                            await doc.save();
                            const saved_user = await UserModel.findOne({email:email})
                            const token = jwt.sign({userId:saved_user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                            res.status(201).send({
                                "Status":"Success",
                                "Message":"User Registered Successfully",
                                "statusCode":201,
                                "token":token
                        })
                        }else{
                            console.log("Please accept terms and conditions",tc)
                            res.status(400).send({"Status":"Failed","message":"Please accept terms and conditions","statusCode":400})
                        }
                        
                    }
                    catch(error){
                        console.log("error",error)
                        res.status(400).send({"Status":"Failed","message":error})
                    }
                    
                }
        }
        }
        else{
            res.send({"Status":"Failed","Message":"All fields are required","statusCode":400})
        }
        
   
    }
    static userLogin = async(req,res)=>{
        try{
            const{email,password}=req.body;
            if (email && password){
                const user = await UserModel.findOne({email:email});
                if (user!==null){
                    const isMatch = await bcrypt.compare(password,user.password)
                    if ((user.email=== email) && isMatch){
                        //generate JWT
                        const token = jwt.sign({userId:user._id},process.env.JWT_SECRET_KEY,{expiresIn:'5d'})
                        res.status(200).send({"Status":"Success","Message":"Login Successful","statusCode":200,"token":token})
                    }else{
                        res.send({"Status":"Failed","Message":"Invalid Credentials"})
                    }
                }else{
                    res.send({"Status":"Failed","Message":"You are not a registered user"})
                }
        }
        else{
            console.log("Body",req.body)
            res.send({"Status":"Failed","Message":"All fields are required","statusCode":400})
        }
    }
    catch(error){
        console.log(error);
        res.status(400).send({"Status":"Failed","Message":"Unale to login"})
    }
}
    static changeUserPassword =async(req,res)=>{
        const {password,password_confirmation} = req.body;
        console.log("request",req.body)
        if (password && password_confirmation){
            if (password !== password_confirmation){
                res.send({"Status":"Failed","Message":"Password and confirm password does not match"})
            }
            else{
                try{
                    const salt = await bcrypt.genSalt(10);
                    const newhashPassword= await bcrypt.hash(password,salt);
                    //user._id is the unique field
                    await UserModel.findByIdAndUpdate(req.user._id,{$set:{password:newhashPassword}})
                    // console.log("user",req.user)
                    res.status(200).send({"Status":"Success","Message":"Password changed successfully"})
                }
                catch(error){
                    console.log("error",error)
                    res.status(400).send({"Status":"Failed","message":error})
                }
            }
            
        }
        else{
            res.send({"Status":"Failed","Message":"All fields are required"})
        }
    }
    static loggedUser =async(req,res)=>{
        res.send(req.user)
    }

    static sendUserResetEmail = async(req,res)=>{
        const {email}=req.body;
        if (email){
            const user =await UserModel.findOne({email:email}).select('-password')
            if (!user){
                res.send({"Status":"Failed","Message":"User does not exist"})
            }
            else{
                console.log("user",user)
                const secret= user._id + process.env.JWT_SECRET_KEY
                const token = jwt.sign({email:email,userId:user._id},secret,{expiresIn:'15m'})
                const link = `http://localhost:3000/api/user/reset/${user._id}/${token}`
                console.log("click below link to reset password",link)
                //send email
                try{
                    let info = await transporter.sendMail({
                        from:process.env.EMAIL_FROM,
                        to:user.email,
                        subject:"Reset Password link ",
                        html:`
                        <h1>Reset Password</h1>
                        <p>Click below link to reset password</p><br>
                        <a href=${link}>Click here</a> to reset your password`
                    })
                    res.send({"Status":"Success","Message":"Please check your email"})
                }
                catch(error){
                    console.log("error",error)
                    res.send({"Status":"Failed","Message":"Something went wrong"})
                }
                
                
        }
    }
        else{
            res.send({"Status":"Failed","Message":"Email is required"})
        }
    }

    static resetUserPassword = async(req,res)=>{
        const {password,password_confirmation} = req.body;
        console.log("request",req.body)
        const {id,token} = req.params
        if (password && password_confirmation && id&& token){
            const user= await UserModel.findById(id)
            if (!user){
                res.send({"Status":"Failed","Message":"Invalid link"})
            }
            else{
                const newSecret = user._id +process.env.JWT_SECRET_KEY
                try{
                    jwt.verify(token,newSecret)
                    if (password===password_confirmation){
                        const salt = await bcrypt.genSalt(10);
                        const newhashPassword= await bcrypt.hash(password,salt);
                        await UserModel.findByIdAndUpdate(user._id,{$set:{password:newhashPassword}})
                        res.send({"Status":"Success","Message":"Password reset successfully"})
                    }
                    else{
                        res.send({"Status":"Failed","Message":"Password and confirm password does not match"})
                    }
                }
                catch(error){
                    console.log("error",error)
                    res.send({"Status":"Failed","Message":"Invalid token"})
                }
            }
        }
        else{
            res.send({"Status":"Failed","Message":"All fields are required"})
        }
    }


}




export default UserController;