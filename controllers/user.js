import {User} from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export const register = async(req,res)=>{
    const {username,email,password} = req.body

    try {
        let user = await User.findOne({email})

        if(user) return res.json({message: "User Already Exist"}); 

        const hashPass = await bcrypt.hash(password,10)

        user = await User.create({username,email,password: hashPass})        

        res.json({message:"User Registered Successfully",user});

    } catch (error) {
        res.json({message:error})
    }
} 

export const login = async (req,res) =>{
    const {email,password} = req.body

    try {
        let user = await User.findOne({email}); 
        // console.log("User is coming from login",user)

        if(!user) return res.json({message: "User not Exist!"}) 

        const validPass = await bcrypt.compare(password, user.password);

        if(!validPass) return res.json({message:"Invalid credentials"}); 

        const token = jwt.sign({userId:user._id},"!@#$%^&*()",{
            expiresIn:'1d'
        })

        res.json({message:`Welcome ${user.username}`,token, username: user.username });

    } catch(error) {
        res.json({message:error.message})
    }
}

export const profile = async(req,res) => {
     res.json({user: req.user})
}