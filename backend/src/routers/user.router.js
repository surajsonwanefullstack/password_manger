import express from "express"


const router = express.Router()

import {registerUser,loginUser,logoutUser,getCurrentUser} from "../controllers/user.controller.js"
import { validateAccessToken } from "../middlewares/validateAccessToken.js"

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/logout",validateAccessToken,logoutUser)
router.get("/me",validateAccessToken,getCurrentUser)

export default router   