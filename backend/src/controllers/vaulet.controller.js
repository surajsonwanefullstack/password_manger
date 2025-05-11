import Valuet from "../models/vaulet.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const getAllValuet = asyncHandler(async (req, res) => {
    const { limit, page } = req.query;
    // cons
    const valuet = await Valuet.find({ user: req.user.id });
    console.log(req.user)
    if (!valuet) {
        throw new ApiError(404, "Valuet not found");
    }
    return res.json(new ApiResponse(200, valuet, "Valuet found"));
})

const addValuet = asyncHandler(async (req, res) => {
    const { name, username, password } = req.body;
    if ([name, username, password].some(data => data?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }
    const valuet = await Valuet.create({ name, username, password, user: req.user.id });
    return res.status(201).json(new ApiResponse(201, valuet, "Valuet created successfully"));
});


const getSingleVaulet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const valuet = await Valuet.findById(id);
    if (!valuet) {
        throw new ApiError(404, "Valuet not found")
    }
    return res.json(new ApiResponse(200, valuet, "Valuet found"))
})

const editValuet = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const { name, username, password } = req.body;
    if ([name, username, password].some(data => data?.trim() === "")) {
        throw new ApiError(400, "All fields are required")
    }

    const valuet = await Valuet.findByIdAndUpdate(id,{
        name,
        username,
        password
    });
    if (!valuet) {
        throw new ApiError(404, "Valuet not found")
    }
    return res.json(new ApiResponse(200, valuet, "Valuet updated"))
})
const deleteValuet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const valuet = await Valuet.findByIdAndDelete(id);
    if (!valuet) {
        throw new ApiError(404, "Valuet not found")
    }
    return res.json(new ApiResponse(200, valuet, "Valuet deleted"))
})

export { getAllValuet, addValuet, getSingleVaulet, editValuet,deleteValuet }