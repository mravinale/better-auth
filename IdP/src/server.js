import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './infrastructure/auth.js'; 

const app = express();
const port = process.env.PORT || 3000; 

// Mount the Better Auth handler - this must come before express.json()
app.all('/api/auth/*', toNodeHandler(auth));

// Parse JSON bodies
app.use(express.json());


// Start the server
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`); 
  console.log(`Better Auth Reference available at http://localhost:${port}/api/auth/reference`);
});
