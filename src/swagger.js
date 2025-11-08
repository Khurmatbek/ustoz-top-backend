import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

export const swaggerDocs = (app, port) => {
  // Dynamic server URL - Railway yoki local
  const isDevelopment = process.env.NODE_ENV !== 'production';
  const serverUrl = isDevelopment
    ? `http://localhost:${port}`
    : 'https://ustoz-top.up.railway.app';

  const options = {
    definition: {
      openapi: "3.0.0",
      info: {
        title: "Ustoz Top API",
        version: "1.0.0",
        description: "O'qituvchi topish loyihasi uchun backend API",
      },
      servers: [
        {
          url: serverUrl,
          description: isDevelopment ? "Local server" : "Production server (Railway)"
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          }
        }
      },
      security: [
        {
          bearerAuth: []
        }
      ]
    },
    apis: ["./src/routes/*.js"],
  };

  const swaggerSpec = swaggerJsDoc(options);

  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customSiteTitle: "Ustoz Top API Documentation"
  }));

  console.log(`📚 Swagger running on ${serverUrl}/api/docs`);
};
