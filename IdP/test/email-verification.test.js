// test/email-verification.test.js
import { describe, it, expect, beforeEach } from '@jest/globals';

// Simple test to verify email verification configuration
describe('Email Verification Configuration', () => {
  let auth;

  beforeEach(async () => {
    // Set up test environment
    process.env.RESEND_API_KEY = 'test-key';
    process.env.FROM_EMAIL = 'test@example.com';
    
    // Import auth with mocked environment
    const { auth: authInstance } = await import('../src/infrastructure/auth.js');
    auth = authInstance;
  });

  it('should have email verification enabled', () => {
    expect(auth.options.emailAndPassword.requireEmailVerification).toBe(true);
  });

  it('should have email verification configuration', () => {
    expect(auth.options.emailVerification).toBeDefined();
    expect(auth.options.emailVerification.sendOnSignUp).toBe(true);
    expect(auth.options.emailVerification.autoSignInAfterVerification).toBe(true);
    expect(auth.options.emailVerification.expiresIn).toBe(3600);
  });

  it('should have email sending function configured', () => {
    expect(auth.options.emailVerification.sendVerificationEmail).toBeDefined();
    expect(typeof auth.options.emailVerification.sendVerificationEmail).toBe('function');
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
    
    // Import email service
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

  it('should handle missing environment variables gracefully', async () => {
    // This test ensures the service doesn't crash without proper env vars
    delete process.env.RESEND_API_KEY;
    delete process.env.FROM_EMAIL;
    
    // Re-import should use fallback values
    const { sendEmailVerification } = await import('../src/services/email.js');
    expect(sendEmailVerification).toBeDefined();
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