import { betterAuth } from "better-auth"
import { bearer } from "better-auth/plugins"
import Database from "better-sqlite3";
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
    database: new Database("database.sqlite"),
});