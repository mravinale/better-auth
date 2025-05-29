import { betterAuth } from "better-auth"
import { bearer } from "better-auth/plugins"
import { Pool } from "pg";
import dotenv from "dotenv"
dotenv.config();

export const auth = betterAuth({
    plugins: [bearer()],
    emailAndPassword: {
        enabled: true
    },
    secret: process.env.AUTH_SECRET || 'dev-secret-key',
    baseUrl: process.env.BASE_URL || 'http://localhost:3005',
    api: {
        prefix: '/api/auth',
    },
    debug: true,
    database: new Pool({
        connectionString: process.env.POSTGRES_CONNECTION_STRING,
    }),
    trustedOrigins: (process.env.TRUSTED_ORIGINS || 'http://localhost:3000').split(','),
});