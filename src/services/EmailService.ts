import { injectable, inject } from "tsyringe";
import { Resend } from "resend";
import { IEmailService, EmailPayload, EmailVerificationPayload, PasswordResetPayload, OrganizationInvitationPayload } from "../infrastructure/interfaces/IEmailService.js";
import type { IConfigService } from "../infrastructure/interfaces/IConfigService.js";

@injectable()
export class EmailService implements IEmailService {
  private resendClient: Resend;

  constructor(@inject("IConfigService") private configService: IConfigService) {
    this.resendClient = new Resend(this.configService.getResendApiKey());
    console.log("Resend client initialized");
  }

  async sendEmail({ to, subject, html, text }: EmailPayload) {
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
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }

  async sendPasswordResetEmail({ user, url, token }: PasswordResetPayload): Promise<void> {
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

  async sendEmailVerification({ user, url, token }: EmailVerificationPayload): Promise<void> {
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

  async sendOrganizationInvitation({ id, email, role, organization, inviter }: OrganizationInvitationPayload): Promise<void> {
    const inviteLink = `${this.configService.getFeUrl()}/accept-invitation/${id}`;
    console.log("Organization invitation URL:", inviteLink);

    const subject = `Invitation to join ${organization.name}`;
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>You're Invited to Join ${organization.name}</h2>
            <p>Hi,</p>
            <p>${inviter.user.name || inviter.user.email} has invited you to join <strong>${organization.name}</strong> as a <strong>${role}</strong>.</p>
            <div style="margin: 20px 0;">
                <a href="${inviteLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
                    Accept Invitation
                </a>
            </div>
            <p>If you don't want to join this organization, you can safely ignore this email.</p>
            <p>This invitation link will expire soon.</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">
                Invited by: ${inviter.user.email}<br>
                Organization: ${organization.name}<br>
                Role: ${role}
            </p>
        </div>`;

    const text = `You've been invited to join ${organization.name} as a ${role}. Accept the invitation using this link: ${inviteLink}`;

    const { data, error } = await this.resendClient.emails.send({
      from: this.configService.getFromEmail(),
      to: email,
      subject,
      html,
      text,
    });

    if (error) {
      console.error("Error sending organization invitation email:", error);
      throw new Error("Failed to send organization invitation email");
    }

    console.log("Organization invitation email sent successfully:", data);
  }
}