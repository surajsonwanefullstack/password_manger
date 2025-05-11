import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";   
const validateAccessToken = asyncHandler(async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    if (!accessToken) {
        throw new ApiError(401, "Access token not found");
    }
    const user = jwt.verify(accessToken, process.env.JWT_SECRET);
    console.log(user)
    req.user = user;
    next();
})

export {validateAccessToken}