import { Schema } from "mongoose"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    username: { type: String, required: true,index:true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String, required: false }
}, { timestamps: true })

// userSchema.index({ email: 1 }, { unique: true })

userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next()
    this.password = bcrypt.hashSync(this.password, 8)
    return next()
})
userSchema.methods.checkPassword = function (password) {
    return bcrypt.compareSync(password, this.password)
}

userSchema.methods.generateAccessToken = function () {
    return jwt.sign({ id: this._id, username: this.username, email: this.email }, process.env.JWT_SECRET, { expiresIn: "1d" })
}
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
}



const User = mongoose.model("User", userSchema)
export default User