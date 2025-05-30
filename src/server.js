import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './infrastructure/auth.js';
import apiRoutes from './infrastructure/routes.js';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './infrastructure/swagger.js';

const app = express();
const port = process.env.PORT || 3000;

// Mount Swagger UI for all endpoints (custom + Better Auth)
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Mount the Better Auth handler - this must come before express.json()
app.all('/api/auth/*', toNodeHandler(auth));

// Parse JSON bodies
app.use(express.json());

// Mount unified API routes
app.use('/api', apiRoutes);

// Start the server
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
  console.log(`Endpoints Docs available at http://localhost:${port}/docs`); 
  console.log(`Better Auth Reference available at http://localhost:${port}/api/auth/reference`);
});
