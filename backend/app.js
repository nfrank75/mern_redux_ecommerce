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
import orderRoutes from './routes/orders.js';
import reviewRoutes from './routes/review.js';

import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

app.use('/api/v1/', productRoutes);
app.use('/api/v1/', authRoutes);
app.use('/api/v1', orderRoutes);
app.use('/api/v1', reviewRoutes);

// using error middleware
app.use(errorMiddleware);


const swaggerOptions  = {
    definition: {
      openapi: '3.0.0',
      swagger: '3.0.0',
      info: {
        title: 'MERN ECOMMERCE API Documentation',
        version: '1.0.0',
        description: 'Documentation for mern ecommerce API',
        contact: {
          name: 'nfrank',
          url: 'nfrank.com',
          email: 'nfrank@gmail.com'
        }
      },
      servers: [
        {
          url: 'http://localhost:3000', // Remplacez par l'URL de votre serveur
        },
      ],
    },
    apis: ['./controllers/*.js'], // Remplacez par le chemin vers vos fichiers de routes
};

const swaggerSpec  = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {explorer: true} ));

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