import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 'test-api-key');

export const sendVerificationEmail = async ({ to, subject, html, text }) => {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'noreply@yourdomain.com',
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

export const sendEmailVerification = async ({ user, url, token }) => {
    const subject = 'Verify your email address';
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify Your Email Address</h2>
            <p>Hi ${user.name || user.email},</p>
            <p>Please click the link below to verify your email address:</p>
            <div style="margin: 20px 0;">
                <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
            </div>
            <p>If you didn't request this verification, you can safely ignore this email.</p>
            <p>This link will expire in 1 hour.</p>
        </div>
    `;
    const text = `
        Verify Your Email Address
        
        Hi ${user.name || user.email},
        
        Please click the link below to verify your email address:
        ${url}
        
        If you didn't request this verification, you can safely ignore this email.
        This link will expire in 1 hour.
    `;

    return await sendVerificationEmail({
        to: user.email,
        subject,
        html,
        text
    });
};