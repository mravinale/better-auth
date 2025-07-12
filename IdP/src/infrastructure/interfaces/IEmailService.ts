export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export interface EmailVerificationPayload {
  user: User;
  url: string;
  token: string;
}

export interface PasswordResetPayload {
  user: User;
  url: string;
  token: string;
}

export interface IEmailService {
  sendEmail(payload: EmailPayload): Promise<any>;
  sendPasswordResetEmail(payload: PasswordResetPayload): Promise<void>;
  sendEmailVerification(payload: EmailVerificationPayload): Promise<void>;
}