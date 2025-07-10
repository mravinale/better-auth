// test/setup.js
import "reflect-metadata";
import express from 'express';
import dotenv from 'dotenv';
import { toNodeHandler } from 'better-auth/node';
import { container } from "tsyringe";
import { ConfigService } from "../src/services/ConfigService.js";
import { EmailService } from "../src/services/EmailService.js";
import { AuthService } from "../src/services/AuthService.js";

// Load test environment variables from .env.test file
dotenv.config({ path: './.env.test' });

// Register services with dependency injection container
container.register("IConfigService", { useClass: ConfigService });
container.register("IEmailService", { useClass: EmailService });
container.register("IAuthService", { useClass: AuthService });

export const testContainer = container;

export function createTestApp() {
  const app = express();
  const authService = testContainer.resolve('IAuthService');
  app.all('/api/auth/*', toNodeHandler(authService.getAuthInstance()));
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
  
  try {
    const authService = testContainer.resolve('IAuthService');
    const authInstance = authService.getAuthInstance();
    if (authInstance.database && typeof authInstance.database.end === 'function') {
      await authInstance.database.end();
    }
  } catch (error) {
    console.log('Error during test cleanup:', error.message);
  }
}