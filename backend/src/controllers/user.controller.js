import User from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateAccessAndRefreshToken = async (id) => {
    const user = await User.findById(id)
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken = refreshToken
    await user.save({ new: true })
    return { accessToken, refreshToken }
}

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
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    return res.
        cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
        .json(new ApiResponse(200, { accessToken, refreshToken }, "Login successful"));
})
)

const logoutUser = (asyncHandler(async (req, res) => {
    await User.findOneAndUpdate({ _id: req.user.id },
        { $unset: { refreshToken: 1 } })
    res.clearCookie("accessToken", "");
    return res.json(new ApiResponse(200, {}, "Logout successful"));
}))

const getCurrentUser = (asyncHandler(async (req, res) => {
    const user = await User.findOne({ _id: req.user.id });
    console.log(user, req.user)
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.json(new ApiResponse(200, user, "User found"));
}))

const refreshRefreshToken = asyncHandler(async (req, res) => {
    const userRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
    if (!userRefreshToken) {
        throw new ApiError(401, "Refresh token not found");
    }
    console.log(userRefreshToken)
    const user = await User.findOne({ refreshToken: userRefreshToken });
    if (!user) {
        throw new ApiError(401, "Invalid refresh token");
    }
    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id)

    return res
        .cookie("accessToken", accessToken, { httpOnly: true, secure: true })
        .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true })
        .json(new ApiResponse(200, { accessToken }, "Token refreshed"));
})


export { registerUser, loginUser, logoutUser, getCurrentUser,refreshRefreshToken };