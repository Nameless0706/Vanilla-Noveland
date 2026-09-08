import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './src/config/Database.config.js';

import authRoute from './src/routes/Auth.route.js';
import userRoute from './src/routes/User.route.js';


const app = express();
const port = 3000;

app.use(cors({
  origin: "http://localhost:5173",  
  credentials: true
})); // for CORS with cookie

app.use(cookieParser());
app.use(express.json());




app.use('/api/auth', authRoute);
app.use('/api/profile', userRoute);



await connectDB();
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
