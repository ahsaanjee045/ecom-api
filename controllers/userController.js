import User from "../models/userModel.js";
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();


/**
 * This function registers a user, hashes its password and generates a token to authorize it in another operations
 * data : {
 *  username : String,
 *  email : String,
 * password : String
 * }
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
export const registerUser = async (req, res) => {
    const data = req.body;
    try {
        const existinguser = await User.findOne({email : data.email});
        if(existinguser){
            return res.status(400).json({message : "User Already Exists"})
        }
        let hashedPassword = await bcryptjs.hash(data.password, 10);
        data.password = hashedPassword;
        const newUser = await new User(data).save();
        const token = jwt.sign({_id : newUser._id}, process.env.SECRET_KEY, {
            expiresIn : "24hrs"
        } )
        return res.status(201).json({
            _id : newUser._id,
            username : newUser.username,
            email : newUser.email,
            createdAt : newUser.createdAt,
            message : "Register Successfull",
            token
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

export const loginUser = async (req, res) => {
    const data = req.body;
    console.log(data)

    try {
        const existinguser = await User.findOne({email : data.email});
        console.log(existinguser)
        if(!existinguser){
            return res.status(401).json({message : "User Not Found"})
        }
        const decodePassword = await bcryptjs.compare(data.password, existinguser.password);
        console.log(decodePassword)

        if(!decodePassword){
            return res.status(401).json({message : "Invalid Details"})
        };
        const token = jwt.sign({_id : existinguser._id}, process.env.SECRET_KEY, {
            expiresIn : "24hrs"
        } );
        res.status(200).json({
            message : "Login Success",
            _id : existinguser._id,
            username : existinguser.username,
            email : existinguser.email,
            createdAt : existinguser.createdAt,
            token

        })
    } catch (error) {
        return res.status(500).json(error)
    }
}