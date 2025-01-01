import swaggerJsdoc, { SwaggerDefinition, Options } from "swagger-jsdoc";
const port = process.env.PORT;
const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Library Management System API",
    version: "1.0.0",
    description: "API Documentation",
  },
  servers: [
    {
      url: `http://localhost:${port}`,
      description: "Local Development Server",
    },
    {
      url: `https://.../api/v1`,
      description: "Production Server",
    },
  ],
  tags: [
    {
      name: "default",
      description: "A list of all default routes",
    },
    {
      name: "Authentication",
      description: "A list of routes for Authentication",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const options: Options = {
  swaggerDefinition,
  apis: ["./src/docs/**/*.ts"],
};
const swaggerDoc = swaggerJsdoc(options);
export default swaggerDoc;
