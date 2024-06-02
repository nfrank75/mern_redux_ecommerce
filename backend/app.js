import express from 'express';
import dotenv from 'dotenv';
import errorMiddleware from './middlewares/errors.js';
import {connectDatabase} from "./config/dbConnect.js";

import cookieParser from "cookie-parser";

const app = express();

//Handle Uncaught exceptions
process.on('uncaughtException', (err) =>{
    console.log(`ERROR: ${err}`);
    console.log('shutting dow due to uncaught error');
    process.exit(1);
}),



//import .env
dotenv.config({ path : "backend/config/config.env"});
const PORT = process.env.PORT;
const DEV = process.env.DEV

//connect database
connectDatabase();

app.use(express.json());
app.use(cookieParser());


// import all the routes 
import productRoutes from "./routes/products.js";
import  authRoutes  from './routes/auth.js';


app.use('/api/v1/', productRoutes);
app.use('/api/v1/', authRoutes);


// using error middleware
app.use(errorMiddleware);


const server = app.listen(PORT, () => {
    console.log(`server started on ${PORT} in ${process.env.NODE_ENV} mode.`);
});

// Handle Unhandled Promise rejections
process.on("unhandledRejection", (err) => {
    console.log(`ERROR, ${err}`);
    console.log("shutting down server due to unhandled promise rejection");
    server.close(() => {
        process.exit(1);
    });
});