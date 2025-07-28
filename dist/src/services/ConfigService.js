var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { injectable } from "tsyringe";
import dotenv from "dotenv";
let ConfigService = class ConfigService {
    constructor() {
        dotenv.config();
    }
    getPort() {
        return parseInt(process.env.PORT || "3000", 10);
    }
    getAuthSecret() {
        return process.env.AUTH_SECRET;
    }
    getBaseUrl() {
        return process.env.BASE_URL;
    }
    getDatabaseUrl() {
        return process.env.DATABASE_URL;
    }
    getTrustedOrigins() {
        return process.env.TRUSTED_ORIGINS
            ? process.env.TRUSTED_ORIGINS.split(",")
            : [process.env.BASE_URL, process.env.FE_URL].filter(Boolean);
    }
    getResendApiKey() {
        return process.env.RESEND_API_KEY;
    }
    getFromEmail() {
        return process.env.FROM_EMAIL;
    }
    getFeUrl() {
        return process.env.FE_URL;
    }
    isTestMode() {
        return process.env.NODE_ENV === "test";
    }
    validateEnvironment() {
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
        const missing = [];
        requiredVars.forEach((varName) => {
            if (!process.env[varName]) {
                missing.push(varName);
            }
        });
        if (missing.length > 0) {
            throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
        }
        console.log("✅ All required environment variables are present");
    }
};
ConfigService = __decorate([
    injectable(),
    __metadata("design:paramtypes", [])
], ConfigService);
export { ConfigService };
