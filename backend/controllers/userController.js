import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import UserModel from '../models/userModel.js';
import userModel from '../models/userModel.js';

// Register User
const registerUser = async (req, res) => {
    try {
        
        const { name, email, password } = req.body;

        if(!name || !email || !password) {
            return res.json({ success : false , message: "Please fill all fields" });
        }

        if(!validator.isEmail(email)) {
            return res.json({ success : false , message: "Please enter a valid email" });
        }

        if(password.length < 6) {
            return res.json({ success : false , message: "Password must be at least 6 characters" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const userData = {
            name , email , password: hashedPassword
        }

        const newUser = new UserModel(userData)
        const user = await newUser.save();

        const token = jwt.sign({id : user._id} , process.env.JWT_SECRET , { expiresIn: '7d' })

        res.json({ success: true, message: "User registered successfully", user });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}

const loginUser = async (req, res) => {
    try{
        
        const {email , password} = req.body;

        if(!email || !password){
            return res.json({success: false , message: "Please fill all fields"});
        }

        const user = await userModel.findOne({email})

        if(!user){
            return res.json({success: false , message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password , user.password);

        if(!isMatch){
            res.json({success: false , message: "Invalid credentials"});
        }else{
            const token = jwt.sign({id : user._id} , process.env.JWT_SECRET)
            res.json({ success: true, message: "User logged in successfully", user , token });
        }

    }
    catch(error){
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


export {registerUser , loginUser};