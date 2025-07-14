import { injectable, inject } from "tsyringe";
import { betterAuth } from "better-auth";
import { bearer, openAPI, jwt } from "better-auth/plugins";
import { Pool } from "pg";
import { IAuthService } from "../infrastructure/interfaces/IAuthService.js";
import type { IConfigService } from "../infrastructure/interfaces/IConfigService.js";
import type { IEmailService } from "../infrastructure/interfaces/IEmailService.js";

@injectable()
export class AuthService implements IAuthService {
  private authInstance: ReturnType<typeof betterAuth>;

  constructor(
    @inject("IConfigService") private configService: IConfigService,
    @inject("IEmailService") private emailService: IEmailService
  ) {
    this.authInstance = betterAuth({
      plugins: [bearer(), openAPI(), jwt()],
      emailAndPassword: {
        enabled: true,
        requireEmailVerification: !this.configService.isTestMode(),
        sendResetPassword: this.emailService.sendPasswordResetEmail.bind(this.emailService),
        resetPasswordTokenExpiresIn: 3600,
      },
      emailVerification: {
        sendOnSignUp: !this.configService.isTestMode(),
        autoSignInAfterVerification: true,
        expiresIn: 3600,
        sendVerificationEmail: this.emailService.sendEmailVerification.bind(this.emailService),
      },
      secret: this.configService.getAuthSecret(),
      baseURL: this.configService.getBaseUrl(),
      database: new Pool({
        connectionString: this.configService.getDatabaseUrl(),
      }),
      trustedOrigins: this.configService.getTrustedOrigins(),
    });
  }

  getAuthInstance() {
    return this.authInstance;
  }
}