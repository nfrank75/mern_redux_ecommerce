import express from 'express';
import dotenv from 'dotenv';
import errorMiddleware from './middlewares/errors.js';
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

//import database
import {connectDatabase} from "./config/dbConnect.js";

connectDatabase();

app.use(express.json());


// import all the routes of Product
import productRoutes from "./routes/products.js";
app.use('/api/v1/', productRoutes);


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