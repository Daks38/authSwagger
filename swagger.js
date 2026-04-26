const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const {version} = require("./package.json");
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Users API",
      version: version,
      description: "CRUD Users avec JWT",
    },
    servers: [
      {
        // url: "http://localhost:3000",
        url: "https://authback-six.vercel.app",
      },
    ],
  },
  apis: ["./routes/*.js"], 
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = { swaggerUi, swaggerSpec };