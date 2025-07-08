// test/setup.js
// Global test setup for email verification mocking

// Set up global test environment variables
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgresql://test:test@localhost:5432/test';
process.env.AUTH_SECRET = 'test-secret-key';
process.env.JWT_SECRET = 'test-jwt-secret';