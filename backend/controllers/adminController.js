import validator from 'validator';
import bcrypt from 'bcrypt';
import {v2 as cloudinary} from 'cloudinary';
import jwt from 'jsonwebtoken';

import Doctor from '../models/doctorModel.js';

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address
    } = req.body;

    const imageFile = req.file;

    if (
      !name || !email || !password || !speciality ||
      !degree || !experience || !about || !fees || !address
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!imageFile) {
      return res.status(400).json({
        success: false,
        message: "Doctor image is required"
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long"
      });
    }

    const parsedAddress = JSON.parse(address);

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const imageUpload = await cloudinary.uploader.upload(
      imageFile.path,
      { resource_type: "image" }
    );

    const doctorData = {
      name,
      email,
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: parsedAddress,
      image: imageUpload.secure_url,
      date: Date.now()
    };

    const newDoctor = new Doctor(doctorData);
    await newDoctor.save();

    res.json({
      success: true,
      message: "Doctor added successfully"
    });

  } catch (error) {
    console.log("Error in adding doctor", error);
    res.status(500).json({
      success: false,
      message: "Internal server error"
    });
  }
};

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