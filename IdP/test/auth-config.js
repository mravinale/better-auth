// test/auth-config.js
// Test-specific auth configuration that disables email verification
import { betterAuth } from "better-auth"
import { bearer, openAPI, jwt } from "better-auth/plugins"
import { Pool } from "pg";

// Mock email functions for testing
const mockSendEmailVerification = async ({ user, url, token }) => {
  console.log(`Mock: Email verification sent to ${user.email}`);
  return Promise.resolve();
};

const mockSendPasswordResetEmail = async ({ user, url, token }) => {
  console.log(`Mock: Password reset email sent to ${user.email}`);
  return Promise.resolve();
};

export const testAuth = betterAuth({
    plugins: [bearer(), openAPI(), jwt()],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: false
    },
    secret: process.env.AUTH_SECRET || 'test-secret-key-for-testing',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    database: new Pool({
        connectionString: process.env.DATABASE_URL || 'postgresql://mravinale:postgres@localhost:5432/better-auth',
    }),
    trustedOrigins: ['http://localhost:3000', 'http://localhost:8080'],
    logger: {
        disabled: true // Disable Better Auth logging for cleaner test output
    }
});