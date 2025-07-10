import { betterAuth } from "better-auth"
import { bearer, openAPI, jwt } from "better-auth/plugins"
import { Pool } from "pg";
import { sendEmailVerification, sendPasswordResetEmail } from "../services/email.js";

export const auth = betterAuth({
    plugins: [bearer(), openAPI(), jwt()],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
        sendResetPassword: sendPasswordResetEmail,
        resetPasswordTokenExpiresIn: 3600 // 1 hour
    },
    emailVerification: {
        sendOnSignUp: true,
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
    : [process.env.BASE_URL, process.env.FE_URL],
});