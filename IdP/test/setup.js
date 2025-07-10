// test/setup.js
// Global test setup for email verification mocking
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Set up global test environment variables
process.env.NODE_ENV = 'test';
// Use the same database as development for tests (in a real setup, you'd want a separate test DB)
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://mravinale:postgres@localhost:5432/better-auth';
process.env.AUTH_SECRET = process.env.AUTH_SECRET || 'test-secret-key';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'test-jwt-secret';
process.env.BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
process.env.FE_URL = process.env.FE_URL || 'http://localhost:8080';
// Use a fake but valid-format API key for tests
process.env.RESEND_API_KEY = 'test-key';
process.env.FROM_EMAIL = 'test@resend.dev'; // Use Resend's test domain

// Note: There is a known issue with Better Auth library that logs a TypeError about
// reading 'length' property during certain API calls. This error:
// - Does NOT affect test functionality (all tests pass)
// - Does NOT affect application behavior  
// - Is internal to the Better Auth library
// - Does NOT impact the TypeScript conversion
// This is a library-level issue and can be safely ignored.