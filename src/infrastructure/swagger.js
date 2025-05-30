import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Better Auth Demo API',
    version: '1.0.0',
    description: `API documentation for Better Auth Demo (custom + Better Auth endpoints).\n\n---\n\n## Better Auth Endpoints\n\nThe following endpoints are provided by Better Auth. For full details, see [Better Auth Docs](https://docs.betterauth.dev).\n\n- POST /api/auth/signin\n- POST /api/auth/signup\n- GET /api/auth/session\n- POST /api/auth/signout\n- GET /api/auth/jwks\n- ...and more\n\n> These endpoints are handled internally by Better Auth. This Swagger UI only provides a high-level overview.`
  },
  servers: [
    { url: 'http://localhost:3005' }
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check endpoint',
        tags: ['System'],
        responses: {
          200: {
            description: 'API is healthy',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'ok' }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/protected': {
      get: {
        summary: 'Protected endpoint (requires Bearer token)',
        tags: ['System'],
        security: [{ bearerAuth: [] }],
        responses: {
          200: {
            description: 'Authenticated user data',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'success' },
                    data: {
                      type: 'object',
                      properties: {
                        user: {
                          type: 'object',
                          properties: {
                            id: { type: 'string' },
                            email: { type: 'string' }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    status: { type: 'string', example: 'error' }
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    }
  }
};

const options = {
  swaggerDefinition,
  apis: ['./src/infrastructure/routes.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
