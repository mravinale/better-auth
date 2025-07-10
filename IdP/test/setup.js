// test/setup.js
// Global test setup for email verification mocking
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

process.env.NODE_ENV = 'test'; 
// Use the same database as development for tests (in a real setup, you'd want a separate test DB)
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://mravinale:postgres@localhost:5432/better-auth-test';
// Use the same AUTH_SECRET as development to prevent JWT key decryption issues
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'test-secret';
process.env.BASE_URL = 'http://localhost:3000';
process.env.RESEND_API_KEY = 'test-key';
process.env.FROM_EMAIL = 'test@resend.dev'; // Use Resend's test domain

// Note: There is a known issue with Better Auth library that logs a TypeError about
// Cannot read properties of undefined (reading 'length'). This is expected during testing
// and does not affect test results.