import express from 'express';
import { toNodeHandler } from 'better-auth/node';
import { auth } from './auth.js';

const app = express();
const port = process.env.PORT || 3005;

// Mount the Better Auth handler - this must come before express.json()
app.all('/api/auth/*', toNodeHandler(auth));

// Parse JSON bodies
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Middleware to verify Bearer session token using Better Auth
const verifySessionToken = async (req, res, next) => {
  try {
    const session = await auth.api.getSession({ headers: req.headers });
    if (!session || !session.user) {
      return res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
    }
    req.user = session.user;
    next();
  } catch (error) {
    console.error('Bearer token verification error:', error);
    res.status(401).json({ status: 'error', message: 'Invalid or expired token' });
  }
};

// Protected endpoint using Bearer session token
app.get('/api/protected', verifySessionToken, (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: {
        id: req.user.id,
        email: req.user.email
      }
    }
  });
});


// Start the server
app.listen(port, () => {
  console.log(`Better Auth demo listening on http://localhost:${port}`);
});
