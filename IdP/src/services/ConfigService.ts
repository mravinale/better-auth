import { injectable } from "tsyringe";
import { IConfigService } from "../infrastructure/interfaces/IConfigService.js";
import dotenv from "dotenv";

@injectable()
export class ConfigService implements IConfigService {
  constructor() {
    dotenv.config();
  }

  getPort(): number {
    return parseInt(process.env.PORT || "3000", 10);
  }

  getAuthSecret(): string {
    return process.env.AUTH_SECRET!;
  }

  getBaseUrl(): string {
    return process.env.BASE_URL!;
  }

  getDatabaseUrl(): string {
    return process.env.DATABASE_URL!;
  }

  getTrustedOrigins(): string[] {
    return process.env.TRUSTED_ORIGINS
      ? process.env.TRUSTED_ORIGINS.split(",")
      : [process.env.BASE_URL, process.env.FE_URL].filter(Boolean) as string[];
  }

  getResendApiKey(): string {
    return process.env.RESEND_API_KEY!;
  }

  getFromEmail(): string {
    return process.env.FROM_EMAIL!;
  }

  getFeUrl(): string {
    return process.env.FE_URL!;
  }

  isTestMode(): boolean {
    return process.env.NODE_ENV === "test";
  }

  validateEnvironment(): void {
    const requiredVars = [
      "PORT",
      "AUTH_SECRET",
      "BASE_URL",
      "DATABASE_URL",
      "TRUSTED_ORIGINS",
      "RESEND_API_KEY",
      "FROM_EMAIL",
      "FE_URL",
    ];

    const missing: string[] = [];

    requiredVars.forEach((varName) => {
      if (!process.env[varName]) {
        missing.push(varName);
      }
    });

    if (missing.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missing.join(", ")}`
      );
    }

    console.log("✅ All required environment variables are present");
  }
}