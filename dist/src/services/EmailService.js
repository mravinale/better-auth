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
import { injectable, inject } from "tsyringe";
import { Resend } from "resend";
let EmailService = class EmailService {
    configService;
    resendClient;
    constructor(configService) {
        this.configService = configService;
        this.resendClient = new Resend(this.configService.getResendApiKey());
        console.log("Resend client initialized");
    }
    async sendEmail({ to, subject, html, text }) {
        try {
            const { data, error } = await this.resendClient.emails.send({
                from: this.configService.getFromEmail(),
                to,
                subject,
                html,
                text,
            });
            if (error) {
                console.error("Error sending email:", error);
                throw new Error("Failed to send verification email");
            }
            console.log("Email sent successfully:", data);
            return data;
        }
        catch (error) {
            console.error("Error sending email:", error);
            throw error;
        }
    }
    async sendPasswordResetEmail({ user, url, token }) {
        const frontendUrl = `${this.configService.getFeUrl()}/set-new-password?token=${token}`;
        console.log("Password reset URL:", frontendUrl);
        const subject = "Reset your password";
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset Your Password</h2>
            <p>Hi ${user.name || user.email},</p>
            <p>Please click the link below to reset your password. This link will expire soon.</p>
            <div style="margin: 20px 0;">
                <a href="${frontendUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Reset Password
                </a>
            </div>
            <p>If you didn't request this, you can safely ignore this email.</p>
        </div>`;
        const { data, error } = await this.resendClient.emails.send({
            from: this.configService.getFromEmail(),
            to: user.email,
            subject,
            html,
            text: `Reset your password using this link: ${frontendUrl}`,
        });
        if (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send verification email");
        }
        console.log("Email sent successfully:", data);
    }
    async sendEmailVerification({ user, url, token }) {
        const subject = "Verify your email";
        const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Verify Your Email Address</h2>
            <p>Hi ${user.name || user.email},</p>
            <p>Thank you for signing up! Please click the button below to verify your email address.</p>
            <div style="margin: 20px 0;">
                <a href="${url}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Verify Email
                </a>
            </div>
            <p>If you didn't create an account with us, you can safely ignore this email.</p>
            <p>This verification link will expire soon.</p>
        </div>`;
        const text = `Verify your email using this link: ${url}`;
        const { data, error } = await this.resendClient.emails.send({
            from: this.configService.getFromEmail(),
            to: user.email,
            subject,
            html,
            text,
        });
        if (error) {
            console.error("Error sending verification email:", error);
            throw new Error("Failed to send verification email");
        }
        console.log("Verification email sent successfully:", data);
    }
};
EmailService = __decorate([
    injectable(),
    __param(0, inject("IConfigService")),
    __metadata("design:paramtypes", [Object])
], EmailService);
export { EmailService };
