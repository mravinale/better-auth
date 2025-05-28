// src/infrastructure/apiRoutes.js
import express from 'express';
import { verifySessionToken } from '../middleware/authMiddleware.js';
import { getProtected, healthCheck } from '../controllers/mainController.js';

const router = express.Router();

// Health check
router.get('/health', healthCheck);

// Protected endpoint
router.get('/protected', verifySessionToken, getProtected);

export default router;
