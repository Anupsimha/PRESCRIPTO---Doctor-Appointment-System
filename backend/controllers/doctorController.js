import doctorModel from '../models/doctorModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appointmentModel from '../models/appointmentModel.js';

const changeAvailability = async (req, res) => {
    try {
        
        const {doctorId} = req.body;

        const docData = await doctorModel.findById(doctorId);
        await doctorModel.findByIdAndUpdate(doctorId , {available: !docData.available});

        res.status(200).json({ success: true, message: 'Doctor availability updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

const doctorList = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}).select(['-password' , '-email']);
        res.json({success: true , doctors})
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


// API for Doctor Login
const loginDoctor = async (req , res) => {
    try {
        
        const  {email, password} = req.body
        const doctor = await doctorModel.findOne({email})

        if(!doctor){
            return res.json({success: false , message: 'Doctor not found'})
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if(isMatch){
            const token = jwt.sign({id: doctor._id}, process.env.JWT_SECRET)

            res.json({success: true , token})
        }
        else{
            return res.json({success: false , message: 'Invalid Credentials'})
        }

        res.status(200).json({ success: true, message: 'Login Successful' , doctor});

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


// API to get doctor appointments for doctor panel
const appointmentsDoctor = async (req , res) => {
    try {
        
        const docId = req.docId
        const appointments = await appointmentModel.find({docId})

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


// API to mark appointment completed for doctor panel
const appointmentComplete = async (req , res) => {
    try {
        
        const docId = req.docId
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId , {isCompleted: true})
            return res.json({ success: true, message: 'Appointment completed' })
        }
        else{
            return res.json({ success: false, message: 'Mark Failed' })
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


// API to cancel appointment for doctor panel
const appointmentCancel = async (req , res) => {
    try {
        
        const docId = req.docId
        const { appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        if(appointmentData && appointmentData.docId === docId){
            await appointmentModel.findByIdAndUpdate(appointmentId , {cancelled: true})
            return res.json({ success: true, message: 'Appointment cancelled' })
        }
        else{
            return res.json({ success: false, message: 'Cancellation Failed' })
        }


    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


// API to get dashboard data for doctor panel
const doctorDashboard = async (req , res) => {
    try {
        
        const docId = req.docId
        const appointments = await appointmentModel.find({docId})

        let earnings = 0

        appointments.map((item) => {
            if(item.isCompleted || item.payment){
                earnings += item.amount
            }
        })

        let patients = []

        appointments.map((item) => {
            if(!patients.includes(item.userId)){
                patients.push(item.userId)
            }
        })

        const dashData = {
            earnings,
            appointements : appointments.length,
            patients : patients.length,
            latestAppointments : appointments.reverse().slice(0 , 5)
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


// API to get doctor profile for doctor panel
const doctorProfile = async (req , res) => {
    try {
        
        const docId = req.docId
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({ success: true, profileData })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}


// API to update doctor profile for doctor panel
const updateDoctorProfile = async (req , res) => {
    try {
        
        const docId = req.docId
        const {fees , address , available} = req.body

        await doctorModel.findByIdAndUpdate(docId , {fees , address , available})

        res.json({ success: true, message: 'Profile Updated Successfully' })

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export { changeAvailability , doctorList , loginDoctor , appointmentsDoctor , appointmentComplete , appointmentCancel , doctorDashboard , doctorProfile , updateDoctorProfile };