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
    },
    '/api/auth/sign-up/email': {
      post: {
        summary: 'Sign up with email and password',
        tags: ['Better Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', example: 'testpassword123' },
                  name: { type: 'string', example: 'Test User' }
                },
                required: ['email', 'password', 'name']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Successful sign up',
            headers: {
              'set-auth-token': {
                schema: { type: 'string' },
                description: 'Bearer token for session authentication'
              }
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        emailVerified: { type: 'boolean' },
                        image: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: 'Invalid input or user already exists' }
        }
      }
    },
    '/api/auth/sign-in/email': {
      post: {
        summary: 'Sign in with email and password',
        tags: ['Better Auth'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string', format: 'email', example: 'user@example.com' },
                  password: { type: 'string', example: 'testpassword123' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          200: {
            description: 'Successful sign in',
            headers: {
              'set-auth-token': {
                schema: { type: 'string' },
                description: 'Bearer token for session authentication'
              }
            },
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      properties: {
                        id: { type: 'string' },
                        email: { type: 'string' },
                        name: { type: 'string' },
                        emailVerified: { type: 'boolean' },
                        image: { type: 'string', nullable: true },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                      }
                    }
                  }
                }
              }
            }
          },
          400: { description: 'Invalid credentials or missing fields' }
        }
      }
    },
    '/api/auth/sign-out': {
      post: {
        summary: 'Sign out the current user',
        tags: ['Better Auth'],
        responses: {
          200: {
            description: 'User signed out',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    success: { type: 'boolean', example: true }
                  }
                }
              }
            }
          }
        }
      }
    },
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
