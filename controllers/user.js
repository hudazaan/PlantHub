import {User} from '../Models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const register = async(req,res)=>{
    const {username,email,password} = req.body

    if (!username || !email || !password) {
        return res.status(400).json({ message: 'username, email and password are required' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    if (String(password).length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    try {
        let user = await User.findOne({email})

        if(user) return res.status(409).json({message: "User Already Exist"}); 

        const hashPass = await bcrypt.hash(password,10)

        user = await User.create({username,email,password: hashPass})

        res.status(201).json({message:"User Registered Successfully",user: { username: user.username, email: user.email }});

    } catch (error) {
        res.status(500).json({message:'Registration failed'})
    }
} 

export const login = async (req,res) =>{
    const {email,password} = req.body
    const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';

    if (!email || !password) {
        return res.status(400).json({ message: 'email and password are required' });
    }

    if (!isValidEmail(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        let user = await User.findOne({email}); 
        // console.log("User is coming from login",user)

        if(!user) return res.status(404).json({message: "User not Exist!"}) 

        const validPass = await bcrypt.compare(password, user.password);

        if(!validPass) return res.status(401).json({message:"Invalid credentials"}); 

        const token = jwt.sign({userId:user._id}, jwtSecret, {
            expiresIn:'1d'
        })

        res.status(200).json({message:`Welcome ${user.username}`,token, username: user.username });

    } catch(error) {
        res.status(500).json({message:'Login failed'})
    }
}

export const profile = async(req,res) => {
     res.json({user: req.user})
}