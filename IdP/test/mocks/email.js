// test/mocks/email.js
// Mock email service for testing

export const mockSendEmailVerification = async ({ user, url, token }) => {
  console.log(`Mock: Sending email verification to ${user.email} with URL: ${url}`);
  return { success: true, messageId: 'mock-message-id' };
};

export const mockSendPasswordResetEmail = async ({ user, url, token }) => {
  console.log(`Mock: Sending password reset email to ${user.email} with URL: ${url}`);
  return { success: true, messageId: 'mock-message-id' };
};

export const mockSendEmail = async ({ to, subject, html, text }) => {
  console.log(`Mock: Sending email to ${to} with subject: ${subject}`);
  return { success: true, messageId: 'mock-message-id' };
};