import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {v2 as cloudinary} from 'cloudinary';
import razorpay from 'razorpay';

import userModel from '../models/userModel.js';
import doctorModel from '../models/doctorModel.js';
import appointmentModel from '../models/appointmentModel.js';

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

        const newUser = new userModel(userData)
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


// API to get User profile data
const getProfile = async (req, res) => {
    try {
        
        const userId = req.userId;
        const userData = await userModel.findById(userId).select('-password');

        res.json({ success: true, userData });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


// API to update User profile data
const updateProfile = async (req , res) => {
    try {
        
        const userId = req.userId;
        const { name , phone , address , dob , gender } = req.body;
        const imageFile = req.file;

        if(!name || !phone || !dob || !gender){
            return res.json({ success : false , message: "Please fill all fields" });
        }

        await userModel.findByIdAndUpdate(userId , {name , phone , address : JSON.parse(address) , dob , gender})

        if(imageFile){
            // Upload Image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path , {
                resource_type : 'image',
            });
            const imageUrl = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId , {image : imageUrl})
        }

        res.json({ success: true, message: "Profile updated successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


// API to book appointment
const bookAppointment = async (req , res) => {
    try {
        
        const { docId, slotDate, slotTime } = req.body;
        const userId = req.userId;
        const docData =  await doctorModel.findById(docId).select('-password')
        
        if(docData.available === false) {
            return res.json({success : false , message : 'Doctor is not available'})
        }

        let slots_booked = docData.slots_booked

        // Check if slot is already booked
        if(slots_booked[slotDate]){
            if(slots_booked[slotDate].includes(slotTime)){
                return res.json({success : false , message : 'Doctor Slot is not available'})
            }
            else{
                slots_booked[slotDate].push(slotTime)
            }
        }
        else{
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appointmentData = {
            userId , 
            docId , 
            userData , 
            docData , 
            slotDate , 
            slotTime , 
            amount : docData.fees , 
            date : Date.now(),
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save();

        await doctorModel.findByIdAndUpdate(docId , {slots_booked})

        res.json({ success: true, message: "Appointment booked successfully" });

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


// API to get User Appointments
const listAppointment = async (req , res) => {
    try {
        
        const userId = req.userId
        const appointments = await appointmentModel.find({userId})

        res.json({ success: true, appointments })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


// API to cancel Appointment
const cancelAppointment = async (req , res) => {
    try {
        
        const userId = req.userId
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify Appointment User
        if(appointmentData.userId !== userId){
            return res.json({ success : false , message : 'You are not authorized to cancel this appointment' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId , {cancelled : true})

        // Releasing Doctor Slot
        const {docId, slotDate, slotTime} = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId , {slots_booked})

        res.json({ success: true, message: "Appointment cancelled successfully" })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


const razorpayInstance = new razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
})

// API to make payment of appointment using razorpay
const paymentRazorpay = async (req , res) => {

    try {

        const {appointmentId} = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(!appointmentData || appointmentData.cancelled){
            return res.json({ success : false , message : 'Appointment Cancelled or not found' })
        }

        // Creating Options for razorpay payment
        const options = {
            amount : appointmentData.amount * 100,
            currency : process.env.CURRENCY,
            receipt : appointmentId,
        }

        // Creating order in razorpay
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


// API to verify payment of razorpay
const verifyRazorpay = async (req , res) => {
    try {
        
        const {razorpay_order_id} = req.body
        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

        if(orderInfo.status === 'paid'){
            await appointmentModel.findByIdAndUpdate(orderInfo.receipt , {payment : true})
            res.json({ success: true, message: 'Payment verified successfully' })
        }
        else{
            res.json({ success: false, message: 'Payment not verified' })
        }

    } catch (error) {
        console.error(error);
        res.json({ success: false, message: error.message });
    }
}


export {registerUser , loginUser , getProfile , updateProfile , bookAppointment , listAppointment , cancelAppointment , paymentRazorpay , verifyRazorpay};