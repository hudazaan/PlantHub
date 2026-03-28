import { User } from "../Models/User.js"; 
import jwt from 'jsonwebtoken' 

export const Authenticate = async (req,res,next) => {
    const token = req.header("Auth")
    const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

    try {
        if(!token) return res.status(401).json({message:"login first"})

        const decode = jwt.verify(token, jwtSecret); 

        // console.log("This is decoded data",decode) 

        const id = decode.userId 

        let user = await User.findById(id)

        if(!user) return res.status(404).json({message:"User not exist"})

        req.user = user

        next();

    } catch (error) {
         res.status(401).json({message:'Unauthorized'}) 
    }
} 