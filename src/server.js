import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './infrastructure/auth.js';
import apiRoutes from './infrastructure/routes.js';

const app = express();
const port = process.env.PORT || 3005;

// Mount the Better Auth handler - this must come before express.json()
app.all('/api/auth/*', toNodeHandler(auth));

// Parse JSON bodies
app.use(express.json());

// Mount unified API routes
app.use('/api', apiRoutes);

// Start the server
app.listen(port, () => {
  console.log(`Better Auth demo listening on http://localhost:${port}`);
});
