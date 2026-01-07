import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import eventRoutes from './routes/event.js';


dotenv.config({ quiet: true });


const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

//server upload image
app.use("/uploads", express.static("uploads"));

//routes server 
app.use("/api/v3/app", eventRoutes);



const PORT = process.env.PORT || 5000;

app.listen(PORT, () =>{
    console.log(`Server is running on port ${PORT}`);
})