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

export { changeAvailability , doctorList , loginDoctor , appointmentsDoctor};