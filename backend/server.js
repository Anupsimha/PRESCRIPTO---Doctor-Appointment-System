import express from 'express';
import cors from 'cors';
import 'dotenv/config';

import connectDB from './config/mongodb.js';
import connectCloudinary from './config/cloudinary.js';

// app config
const app = express();
const PORT = process.env.PORT || 4000;


// middlwares
app.use(express.json());
app.use(cors());

// api endpoints
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(PORT, async () => {
  await connectDB();
  await connectCloudinary();
  console.log(`Server is running on port ${PORT}`);
});