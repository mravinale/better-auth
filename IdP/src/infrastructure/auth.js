import { betterAuth } from "better-auth"
import { bearer, openAPI, jwt } from "better-auth/plugins"
import { Pool } from "pg";
import dotenv from "dotenv"
import { sendEmailVerification } from "../services/email.js";
dotenv.config();

export const auth = betterAuth({
    plugins: [bearer(), openAPI(), jwt()],
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },
    emailVerification: {
        sendOnSignUp: true,
        autoSignInAfterVerification: true,
        expiresIn: 3600, // 1 hour
        sendVerificationEmail: sendEmailVerification
    },
    secret: process.env.AUTH_SECRET || 'dev-secret-key',
    baseUrl: process.env.BASE_URL || 'http://localhost:3000',
    api: {
        prefix: '/api/auth',
    },
    debug: true,
    database: new Pool({
        connectionString: process.env.DATABASE_URL,
    }),
    trustedOrigins: (process.env.TRUSTED_ORIGINS || 'http://localhost:3000').split(','),
});