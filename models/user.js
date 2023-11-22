import mongoose from "mongoose";

//defining Schema

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    password:{
        type:String,
        required:true
    },
    tc:{
        type:Boolean,
        required:true,
        // default:false
    }// terms and conditions
    
},{
    timestamps:true
})

// Model

const UserModel = mongoose.model("user",userSchema)

export default UserModel;