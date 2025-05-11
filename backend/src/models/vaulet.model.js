import mongoose from "mongoose"
import { Schema } from "mongoose"

const vauletSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    user:{
        type: Schema.Types.ObjectId,
        ref:"User",
        required: true
    }
})

const Vaulet = mongoose.model("Vaulet", vauletSchema)
export default Vaulet