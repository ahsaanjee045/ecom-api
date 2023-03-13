import User from "../models/userModel.js";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const userAuth = async (req, res, next) => {
    try {
        const headers = req.headers.authorization
        if(!headers){
            return res.status(401).json({
                message: "No token provided"
            })
        }
        const token = headers.split(" ")[1]
        const {_id} = jwt.verify(token , process.env.SECRET_KEY);
        const user = await User.findById(_id);
        if(!user){
            return res.status(401).json({
                message: "Invalid token"
            })
        }
        req.user = user
        next()
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}

export const adminAuth = async (req, res, next) => {
    try {
        const headers = req.headers.authorization
        if(!headers){
            return res.status(401).json({
                message: "No token provided"
            })
        }
        const token = headers.split(" ")[1]
        const {_id} = jwt.verify(token , process.env.SECRET_KEY);
        const user = await User.findById(_id);
        if(!user){
            return res.status(401).json({
                message: "Invalid token"
            })
        }
        if(!user.isAdmin){
            return res.status(401).json({
                message: "You are not an admin"
            })
        }
        req.user = user
        next()
    } catch (error) {
        res.status(500).json({ error: error.message })
    }
}