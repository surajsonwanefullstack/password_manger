import express from "express"
import cookieParser from "cookie-parser"
import dotenv from "dotenv"
import { asyncHandler } from "./utils/asyncHandler.js"
const app = express()

import User from "./models/user.model.js"

dotenv.config()

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/",asyncHandler(async (req,res)=>{
    res.json({"test":"success"})
}))


import userRouter from "./routers/user.router.js"
app.use("/api/v1/users",userRouter) 




export {app}