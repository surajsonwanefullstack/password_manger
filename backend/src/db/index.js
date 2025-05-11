import {DB_NAME} from "../constant.js"
import mongoose from "mongoose"
const connectDB =async ()=>{
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URL}/${DB_NAME}`)
        console.log("database connected to "+connection.connection.host)
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}
export {connectDB}