import { betterAuth } from "better-auth"
import { bearer, openAPI, jwt } from "better-auth/plugins"
import { Pool } from "pg";
import dotenv from "dotenv";
import { sendEmailVerification, sendPasswordResetEmail } from "../services/email.js";

// Ensure environment variables are loaded before auth configuration
dotenv.config();

// Check if we're in test mode
const isTestMode = process.env.NODE_ENV === 'test';

export const auth = betterAuth({
    plugins: [bearer(), openAPI(), jwt()],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: !isTestMode, // Disable email verification requirement in test mode
        sendResetPassword: sendPasswordResetEmail,
        resetPasswordTokenExpiresIn: 3600 // 1 hour
    },
    emailVerification: {
        sendOnSignUp: !isTestMode, // Disable sending emails on sign up in test mode
        autoSignInAfterVerification: true,
        expiresIn: 3600, // 1 hour
        sendVerificationEmail: sendEmailVerification
    },
    secret: process.env.AUTH_SECRET,
    baseUrl: process.env.BASE_URL,
    api: {
        prefix: '/api/auth',
    },
    debug: true,
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    trustedOrigins: process.env.TRUSTED_ORIGINS
    ? process.env.TRUSTED_ORIGINS.split(',') 
    : [process.env.BASE_URL, process.env.FE_URL].filter(Boolean) as string[],
});