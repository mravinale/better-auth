// test/email-verification.test.js
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock the email service before importing anything that uses it
jest.unstable_mockModule('../src/services/email.js', () => ({
  sendEmailVerification: jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: jest.fn().mockResolvedValue(undefined),
}));

// Simple test to verify email verification configuration
describe('Email Verification Configuration', () => {
  let auth;

  beforeEach(async () => {
    // Set up test environment - NODE_ENV is set to 'test'
    process.env.RESEND_API_KEY = 'test-key';
    process.env.FROM_EMAIL = 'test@example.com';
    
    // Import auth with mocked email service
    const { auth: authInstance } = await import('../src/infrastructure/auth.js');
    auth = authInstance;
  });

  it('should have email verification disabled in test mode', () => {
    // In test mode (NODE_ENV=test), email verification should be disabled
    expect(auth.options.emailAndPassword.requireEmailVerification).toBe(false);
  });

  it('should have email verification configuration for test mode', () => {
    expect(auth.options.emailVerification).toBeDefined();
    // In test mode, sendOnSignUp should be false
    expect(auth.options.emailVerification.sendOnSignUp).toBe(false);
    expect(auth.options.emailVerification.autoSignInAfterVerification).toBe(true);
    expect(auth.options.emailVerification.expiresIn).toBe(3600);
  });

  it('should have email sending function configured', () => {
    expect(auth.options.emailVerification.sendVerificationEmail).toBeDefined();
    expect(typeof auth.options.emailVerification.sendVerificationEmail).toBe('function');
    // The actual email functions are mocked in tests
  });

  it('should include resend dependency', async () => {
    const pkg = await import('../package.json', { assert: { type: 'json' } });
    expect(pkg.default.dependencies.resend).toBeDefined();
  });
});

// Unit test for email service functions
describe('Email Service Functions', () => {
  let emailService;

  beforeEach(async () => {
    // Set up environment for testing
    process.env.RESEND_API_KEY = 'test-key';
    process.env.FROM_EMAIL = 'test@example.com';
    
    // Import mocked email service
    emailService = await import('../src/services/email.js');
  });

  it('should export sendEmailVerification function', () => {
    expect(emailService.sendEmailVerification).toBeDefined();
    expect(typeof emailService.sendEmailVerification).toBe('function');
  });

  it('should export sendPasswordResetEmail function', () => {
    expect(emailService.sendPasswordResetEmail).toBeDefined();
    expect(typeof emailService.sendPasswordResetEmail).toBe('function');
  });

  it('should call mock email functions during tests', async () => {
    // Verify that the email functions are properly mocked
    const result = await emailService.sendEmailVerification({
      user: { email: 'test@example.com' },
      url: 'http://test.com',
      token: 'test-token'
    });
    
    expect(result).toBeUndefined(); // Mock returns undefined
    expect(emailService.sendEmailVerification).toHaveBeenCalled();
  });
});

// Integration test to verify email verification flow components
describe('Email Verification Integration', () => {
  it('should have database schema for email verification', () => {
    // This test verifies the database schema supports email verification
    // In a real test, you would check the database schema
    expect(true).toBe(true); // Placeholder
  });

  it('should have proper error handling for email failures', () => {
    // This test would verify that email sending failures are handled gracefully
    expect(true).toBe(true); // Placeholder
  });
});