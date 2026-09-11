import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectDB from './src/config/Database.config.js';

import authRoute from './src/routes/Auth.route.js';
import userRoute from './src/routes/User.route.js';
import novelRoute from './src/routes/Novel.route.js';
import forumRoute from './src/routes/Forum.route.js';
import { seedDatabase } from './src/utils/seedData.js';

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
app.use('/api/user', userRoute);
app.use('/api/novels', novelRoute);
app.use('/api/forum', forumRoute);

await connectDB();
await seedDatabase();

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

