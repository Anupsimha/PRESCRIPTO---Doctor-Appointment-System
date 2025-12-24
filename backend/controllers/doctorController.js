import doctorModel from '../models/doctorModel.js';
import bcrypt from 'bcrypt';

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

        if(!isMatch){
            return res.json({success: false , message: 'Invalid Password'})
        }

        res.status(200).json({ success: true, message: 'Login Successful' , doctor});

    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: 'Server Error' });
    }
}

export { changeAvailability , doctorList };