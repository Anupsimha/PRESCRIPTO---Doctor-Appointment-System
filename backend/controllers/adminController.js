import validator from 'validator';
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import jwt from 'jsonwebtoken';

import Doctor from '../models/doctorModel.js';

// API for adding doctor
const addDoctor = async (req , res) => {
    try {
        const {name , email , password , speciality , degree , experience , about , fees , address} = req.body;
        const imageFile = req.file;

        // checking for all data to add doctor
        if(!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address){
            return res.status(400).json({message : "All fields are required"});
        }

        // validating email format
        if(!validator.isEmail(email)){
            return res.status(400).json({message : "Invalid email format"});
        }

        // validating strong password
        if(password.length < 8){
            return res.status(400).json({message : "Password must be at least 8 characters long"});
        }

        // hashing doctor password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password , salt);

        // uploading image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path , {resource_type : "image"});
        const imageUrl = imageUpload.secure_url;

        const doctorData = {
            name,
            email,
            password : hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address,
            date: Date.now()
        }

        const newDoctor = new Doctor(doctorData);
        await newDoctor.save();

        res.json({message : "Doctor added successfully"});

    } catch (error) {
        console.log("Error in adding doctor" , error);  
        return res.status(500).json({message : "Internal server error"});    
    }
}

// API For admin login
const loginAdmin = async (req , res) => {
    try {
        const {email , password} = req.body;

        if(email == process.env.ADMIN_EMAIL && password == process.env.ADMIN_PASSWORD){
            const token = jwt.sign({email, password}, process.env.JWT_SECRET, {expiresIn : "1d"});
            res.json({success : true , message : "Admin logged in successfully" , token});
        }
        else{
            return res.status(401).json({success : false , message : "Invalid admin credentials"});
        }

    } catch (error) {
        console.error("Error in admin login" , error);
        res.status(500).json({success : false , message : "Internal server error"});
    }
}

export {addDoctor , loginAdmin};