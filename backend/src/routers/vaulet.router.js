import express from "express"

const router = express.Router()

import {getAllValuet,addValuet,getSingleVaulet, deleteValuet, editValuet} from "../controllers/vaulet.controller.js"
import { get } from "mongoose"
// import { validateAccessToken } from "../middlewares/validateAccessToken.js"
router.get("/",getAllValuet)
router.post("/add",addValuet)    
router.get("/:id",getSingleVaulet)    
router.delete("/:id",deleteValuet)
router.put("/:id",editValuet)



export default router