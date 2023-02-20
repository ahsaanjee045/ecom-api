import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cors from 'cors'
import userRoutes from './routes/userRoutes.js'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/v1/user", userRoutes);

mongoose.set('strictQuery', false);
mongoose.connect(process.env.MONGO_URI).then(()=> {
    app.listen(process.env.PORT, () => {
        console.log(`Server is Listening on Port ${process.env.PORT} and Connected to database`)
    })
})