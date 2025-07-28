import "reflect-metadata";
import { container } from "tsyringe";
import { ConfigService } from "./services/ConfigService.js";
import { EmailService } from "./services/EmailService.js";
import { AuthService } from "./services/AuthService.js";
container.registerSingleton("IConfigService", ConfigService);
container.registerSingleton("IEmailService", EmailService);
container.registerSingleton("IAuthService", AuthService);
export { container };
