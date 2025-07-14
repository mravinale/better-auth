export interface IConfigService {
  getPort(): number;
  getAuthSecret(): string;
  getBaseUrl(): string;
  getDatabaseUrl(): string;
  getTrustedOrigins(): string[];
  getResendApiKey(): string;
  getFromEmail(): string;
  getFeUrl(): string;
  isTestMode(): boolean;
  validateEnvironment(): void;
}