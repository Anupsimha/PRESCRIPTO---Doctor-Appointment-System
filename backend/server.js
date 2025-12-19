import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';
import adminRouter from './routes/adminRoute.js';
import doctorRouter from './routes/doctorRoute.js';
import userRouter from './routes/userRoute.js';

// app config
const app = express();
const PORT = process.env.PORT || 4000;

// middlwares
app.use(express.json());
app.use(cors());

// api endpoints
app.use('/api/admin' , adminRouter)
app.use('/api/doctors' , doctorRouter)
app.use('/api/user' , userRouter)

app.listen(PORT, async () => {
  await connectDB();
  await connectCloudinary();
  console.log(`Server is running on port ${PORT}`);
});