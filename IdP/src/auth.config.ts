import 'dotenv/config';
import { betterAuth } from 'better-auth';
import { bearer, openAPI, jwt, organization, admin } from 'better-auth/plugins';
import { Pool } from 'pg';

const authConfig = {
  plugins: [bearer(), openAPI(), jwt(), organization({
    sendInvitationEmail: async (_payload: any) => {} // CLI placeholder
  }), admin() ],
  emailAndPassword: { 
    enabled: true, 
    requireEmailVerification: true, 
    resetPasswordTokenExpiresIn: 3600,
    sendResetPassword: async (_payload: any) => {} // CLI placeholder
  },
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 3600,
    sendVerificationEmail: async (_payload: any) => {} // CLI placeholder
  },
  secret: process.env.AUTH_SECRET!,
  baseUrl: process.env.BASE_URL!,
  api: { prefix: '/api/auth' },
  database: new Pool({ connectionString: process.env.DATABASE_URL! }),
  trustedOrigins: process.env.TRUSTED_ORIGINS?.split(',') || [],
};

// Export base configuration for runtime customisation
export { authConfig };
// Minimal Better Auth instance purely for CLI operations (generate / migrate)
export const auth = betterAuth(authConfig);
