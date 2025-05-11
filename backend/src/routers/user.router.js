import express from "express"


const router = express.Router()

import {registerUser,loginUser,logoutUser,getCurrentUser, refreshRefreshToken} from "../controllers/user.controller.js"
import { validateAccessToken } from "../middlewares/validateAccessToken.js"

router.post("/register",registerUser)
router.post("/login",loginUser)
router.post("/logout",validateAccessToken,logoutUser)
router.get("/me",validateAccessToken,getCurrentUser)
router.get("/refresh",refreshRefreshToken)

// importing andding vaulet router
import vauletRouter from "./vaulet.router.js"
router.use("/vaulets",validateAccessToken,vauletRouter)

export default router   