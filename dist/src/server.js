import "reflect-metadata";
import express from 'express';
import cors from 'cors';
import { toNodeHandler } from 'better-auth/node';
import { container } from 'tsyringe';
import { ConfigService } from './services/ConfigService.js';
import { EmailService } from './services/EmailService.js';
import { AuthService } from './services/AuthService.js';
// Register dependencies in the IoC container
container.registerSingleton("IConfigService", ConfigService);
container.registerSingleton("IEmailService", EmailService);
container.registerSingleton("IAuthService", AuthService);
const configService = container.resolve('IConfigService');
const authService = container.resolve('IAuthService');
// Validate all environment variables in one place
configService.validateEnvironment();
const app = express();
const port = configService.getPort();
// CORS middleware: allow any origin (for development only)
app.use(cors({
    origin: true, // Allow any origin
    credentials: true,
}));
// Mount the Better Auth handler - this must come before express.json()
app.all('/api/auth/*', toNodeHandler(authService.authInstance));
// Parse JSON bodies
app.use(express.json());
// Start the server
app.listen(port, () => {
    console.log(`API listening on http://localhost:${port}`);
    console.log(`Better Auth Reference available at http://localhost:${port}/api/auth/reference`);
});
