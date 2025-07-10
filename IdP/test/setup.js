// test/setup.js
import { jest } from '@jest/globals';
import express from 'express';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { auth } from '../src/infrastructure/auth.ts';

// Load test environment variables from .env.test file
dotenv.config({ path: './.env.test' });

// Mock the email service before importing anything that uses it
jest.unstable_mockModule('../src/services/email.ts', () => ({
  sendEmailVerification: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
}));

export function createTestApp() {
  const app = express();
  app.all('/api/auth/*', toNodeHandler(auth));
  app.use(express.json());
  return app;
}

export async function startTestServer(app) {
  return new Promise((resolve) => {
    const server = app.listen(0, () => {
      resolve(server);
    });
  });
}

export async function stopTestServer(server) {
  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (err) reject(err);
      else resolve();
    });
  });
  
  if (auth.database && typeof auth.database.end === 'function') {
    await auth.database.end();
  }
}