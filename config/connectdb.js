import mongoose from 'mongoose';


const connectDb = async(DATABASE_URI) =>{
    // const DATABASE_URI="mongodb+srv://biswalswarup521:Swarup521@cluster0.5eloxjh.mongodb.net/?retryWrites=true&w=majority"
    try{
        const DB_OPTIONS={
            dbName:"AUTH_USING_JWT"
        }
        await mongoose.connect(DATABASE_URI,DB_OPTIONS);
        console.log("connected succesfully")
    }
    catch (error){
        console.log("error",error);
    }
}


export default connectDb;

// const connectDB= async ()=>{
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//         console.log(`\n MongoDB Connected: ${connectionInstance.connection.host}`)


//     } catch(error){
//         console.error("MONGO DB CONNECTION ERROR:",error);
//         process.exit(1)
//     }