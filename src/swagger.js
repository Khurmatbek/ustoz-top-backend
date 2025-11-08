import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Ustoz Top API",
      version: "1.0.0",
      description: "O‘qituvchi topish loyihasi uchun backend API",
    },
    servers: [
      { url: "http://localhost:5000", description: "Local server" },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

export const swaggerDocs = (app, port) => {
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log(`Swagger running on http://localhost:${port}/api/docs`);
};
