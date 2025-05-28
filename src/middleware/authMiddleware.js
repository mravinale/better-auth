// src/middleware/authMiddleware.js
import { auth } from '../infrastructure/auth.js';

export const verifySessionToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('[DEBUG] Authorization header:', authHeader);
    const bearerToken = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : undefined;
    console.log('[DEBUG] Bearer token:', bearerToken);
    const session = await auth.api.getSession({ headers: req.headers });
    console.log('[DEBUG] Session object:', session);
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
