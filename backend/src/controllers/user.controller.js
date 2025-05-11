import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    console.log(req.body)
    if ([username, email, password].some(data => data?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
        console.log(existingUser)
        throw new ApiError(400, "User already exists")
    }
    const user = await User.create({ username, email, password });
    return res.status(201).json(new ApiResponse(201, user, "User created successfully"));
});

const loginUser = (asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if ([email, password].some(data => data.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const user = await User.findOne({ $or: [{ username: email }, { email: email }] });
    if (!user || !user.checkPassword(password)) {
        throw new ApiError(401, "Invalid email or password");
    }
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return res.
    cookie("accessToken", accessToken, { httpOnly: true, secure:true})
    .cookie("refreshToken", refreshToken, { httpOnly: true,secure:true })  
    .json(new ApiResponse(200, { accessToken, refreshToken }, "Login successful"));
})
)

const logoutUser = (asyncHandler(async (req, res) => {
    await User.findOneAndUpdate({ _id: req.user._id }, { refreshToken: "" });
    res.clearCookie("refreshToken", "");
    res.clearCookie("accessToken", "");
    return res.json(new ApiResponse(200, {}, "Logout successful"));
}))

const getCurrentUser = (asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.user.id });
    console.log(user,req.user)
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.json(new ApiResponse(200, user, "User found"));
}))



export { registerUser, loginUser, logoutUser, getCurrentUser };