const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions  = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'MERN ECOMMERCE API Documentation',
        version: '1.0.0',
        description: 'Documentation for mern ecommerce API',
      },
      servers: [
        {
          url: 'http://localhost:3000', // Remplacez par l'URL de votre serveur
        },
      ],
    },
    apis: ['../routes/*.js'], // Remplacez par le chemin vers vos fichiers de routes
  };

  // Générer la spécification Swagger
const swaggerSpec = swaggerJSDoc(swaggerOptions);

export default swaggerJSDoc;