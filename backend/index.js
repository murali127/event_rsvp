import express from 'express';
import{ connectionToDatabase } from "./database/connectionToDatabase.js";
import dotenv from "dotenv";
import authRoutes from './routes/auth-route.js';
import cookieParser from 'cookie-parser';
import cors from "cors";
dotenv.config();

const app = express();
app.use(cors({origin:"http://localhost:5173",credentials: true}));
app.use(express.json());
app.use(cookieParser());

connectionToDatabase();

app.use('/api/auth',authRoutes);


app.listen(3000,()=>{
    console.log('server is running on port 3000');
});

/*.env MONGO_URL=mongodb+srv://muralijay360:Muralijay360@cluster0.slshk.mongodb.net/user?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=mysecrettoken      "mysecrettoken" : Unknown word.
##resend.com : re_6wNN9TNc_Hvp5m7uKxin57CxkDo3bqjWo
RESEND_API_KEY=re_6wNN9TNc_Hvp5m7uKxin57CxkDo3bqjWo
CLIENT_URL=http://localhost:5173*/
