import "reflect-metadata";
import { inject, singleton } from "tsyringe";
import { betterAuth } from "better-auth";
import { authConfig as baseAuthConfig } from "../auth.config.js";
import { Pool } from "pg";
import { IAuthService } from "../infrastructure/interfaces/IAuthService.js";
import type { IConfigService } from "../infrastructure/interfaces/IConfigService.js";
import type { IEmailService } from "../infrastructure/interfaces/IEmailService.js";

@singleton()
export class AuthService implements IAuthService {
  public readonly authInstance: ReturnType<typeof betterAuth>;

  constructor(
    @inject("IConfigService") private configService: IConfigService,
    @inject("IEmailService") private emailService: IEmailService
  ) {
    const runtimeConfig = {
      ...baseAuthConfig,
      emailAndPassword: {
        ...baseAuthConfig.emailAndPassword,
        requireEmailVerification: !this.configService.isTestMode(),
        sendResetPassword: (payload: any) => this.emailService.sendPasswordResetEmail(payload),
      },
      emailVerification: {
        ...baseAuthConfig.emailVerification,
        sendOnSignUp: !this.configService.isTestMode(),
        sendVerificationEmail: (payload: any) => this.emailService.sendEmailVerification(payload),
      },
      secret: this.configService.getAuthSecret(),
      baseUrl: this.configService.getBaseUrl(),
      database: new Pool({ connectionString: this.configService.getDatabaseUrl() }),
      trustedOrigins: this.configService.getTrustedOrigins(),
    } as const;

    this.authInstance = betterAuth(runtimeConfig);
  }

  // No getter needed; authInstance is public
}