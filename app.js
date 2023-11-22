import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import connectDb from './config/connectdb.js'
import userRoutes from "./routes/userRoutes.js";



const app=express()
const port=process.env.PORT
const DATABASE_URI= process.env.DATABASE_URI

//CORS Policy
app.use(cors())

// connect db
connectDb(DATABASE_URI)
.then(()=>{
    app.listen(process.env.PORT||8000,()=>{
        console.log(`APP is listening on ${process.env.PORT||8000}`);
    })
})
.catch((err) =>{
    console.log("mongo db connection failed",err)
})

//  JSON
app.use(express.json())

// Load routes
app.use('/api/v1/users',userRoutes)

// app.listen(port,()=>{
//     console.log('Server is running on port',port)
// })