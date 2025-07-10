import { Resend } from 'resend';

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
}

interface EmailVerificationPayload {
  user: User;
  url: string;
  token: string;
}

interface PasswordResetPayload {
  user: User;
  url: string;
  token: string;
}

/**
 * Singleton pattern for Resend client
 * Ensures only one instance is created and reused
 */
let resendInstance: Resend | null = null;

const getResendClient = (): Resend => {
  if (!resendInstance) {
    resendInstance = new Resend(process.env.RESEND_API_KEY);
    console.log('Resend client initialized');
  }
  return resendInstance;
};

export const sendEmail = async ({ to, subject, html, text }: EmailPayload) => {
    try {
        const resend = getResendClient();
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL!,
            to,
            subject,
            html,
            text
        });

        if (error) {
            console.error('Error sending email:', error);
            throw new Error('Failed to send verification email');
        }

        console.log('Email sent successfully:', data);
        return data;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};

export const sendPasswordResetEmail = async ({ user, url, token }: PasswordResetPayload): Promise<void> => {
    // Modify the URL to point to the frontend app
    const frontendUrl = `${process.env.FE_URL}/set-new-password?token=${token}`;
    console.log('Password reset URL:', frontendUrl);
    
    const subject = 'Reset your password';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset Your Password</h2>
            <p>Hi ${user.name || user.email},</p>
            <p>Please click the link below to reset your password. This link will expire soon.</p>
            <div style="margin: 20px 0;">
                <a href="${frontendUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Reset Password
                </a>
            </div>
            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>`;

    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: user.email,
        subject,
        html,
        text: `Reset your password using this link: ${frontendUrl}`
    });

    if (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }

    console.log('Email sent successfully:', data);
};

export const sendEmailVerification = async ({ user, url, token }: EmailVerificationPayload): Promise<void> => {
    const subject = 'Verify your email';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify Your Email Address</h2>
            <p>Hi ${user.name || user.email},</p>
            <p>Thank you for signing up! Please click the button below to verify your email address.</p>
            <div style="margin: 20px 0;">
                <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
            </div>
            <p>If you didn't create an account with us, you can safely ignore this email.</p>
            <p>This verification link will expire soon.</p>
        </div>`;
    
    const text = `Verify your email using this link: ${url}`;

    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: user.email,
        subject,
        html,
        text
    });

    if (error) {
        console.error('Error sending verification email:', error);
        throw new Error('Failed to send verification email');
    }

    console.log('Verification email sent successfully:', data);
};