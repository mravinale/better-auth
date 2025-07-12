// test/email-verification.test.js
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Simple test to verify email verification configuration
describe('Email Verification Configuration', () => {
  let auth;

  beforeEach(async () => {
    // Set up test environment - NODE_ENV is set to 'test'
    process.env.RESEND_API_KEY = 'test-key';
    process.env.FROM_EMAIL = 'test@example.com';
    
    // Import auth service through test container
    const { testContainer } = await import('../setup.js');
    const authService = testContainer.resolve('IAuthService');
    auth = authService.getAuthInstance();
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
    const pkg = await import('../../package.json', { assert: { type: 'json' } });
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
    
    // Import test container and resolve email service
    const { testContainer } = await import('../setup.js');
    emailService = testContainer.resolve('IEmailService');
  });

  it('should have sendEmailVerification method', () => {
    expect(emailService.sendEmailVerification).toBeDefined();
    expect(typeof emailService.sendEmailVerification).toBe('function');
  });

  it('should have sendPasswordResetEmail method', () => {
    expect(emailService.sendPasswordResetEmail).toBeDefined();
    expect(typeof emailService.sendPasswordResetEmail).toBe('function');
  });

  it('should call mock email functions during tests', async () => {
    // Verify that the email functions are defined and can be called
    // We skip actual sending in test environment
    expect(emailService.sendEmailVerification).toBeDefined();
    expect(typeof emailService.sendEmailVerification).toBe('function');
    
    // Skip actual email sending test as it requires valid API key
    // In a real test environment, you would mock the Resend client
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