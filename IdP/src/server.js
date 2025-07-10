import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import dotenv from 'dotenv';
import { validateAppEnv } from './utils/envValidator.js';
import { auth } from './infrastructure/auth.js';

// Load environment variables
dotenv.config();

// Validate all environment variables in one place
validateAppEnv();

const app = express();
const port = process.env.PORT;

// CORS middleware: allow any origin (for development only)
app.use(cors({
  origin: true,  // Allow any origin
  credentials: true,
}));

// Mount the Better Auth handler - this must come before express.json()
app.all('/api/auth/*', toNodeHandler(auth));

// Parse JSON bodies
app.use(express.json());

// Start the server
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`); 
  console.log(`Better Auth Reference available at http://localhost:${port}/api/auth/reference`);
});
