var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import "reflect-metadata";
import { inject, singleton } from "tsyringe";
import { betterAuth } from "better-auth";
import { authConfig as baseAuthConfig } from "../auth.config.js";
import { Pool } from "pg";
let AuthService = class AuthService {
    configService;
    emailService;
    authInstance;
    constructor(configService, emailService) {
        this.configService = configService;
        this.emailService = emailService;
        const runtimeConfig = {
            ...baseAuthConfig,
            emailAndPassword: {
                ...baseAuthConfig.emailAndPassword,
                requireEmailVerification: !this.configService.isTestMode(),
                sendResetPassword: (payload) => this.emailService.sendPasswordResetEmail(payload),
            },
            emailVerification: {
                ...baseAuthConfig.emailVerification,
                sendOnSignUp: !this.configService.isTestMode(),
                sendVerificationEmail: (payload) => this.emailService.sendEmailVerification(payload),
            },
            secret: this.configService.getAuthSecret(),
            baseUrl: this.configService.getBaseUrl(),
            database: new Pool({ connectionString: this.configService.getDatabaseUrl() }),
            trustedOrigins: this.configService.getTrustedOrigins(),
        };
        this.authInstance = betterAuth(runtimeConfig);
    }
};
AuthService = __decorate([
    singleton(),
    __param(0, inject("IConfigService")),
    __param(1, inject("IEmailService")),
    __metadata("design:paramtypes", [Object, Object])
], AuthService);
export { AuthService };
