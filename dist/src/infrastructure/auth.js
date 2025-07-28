// This file is now deprecated - auth configuration moved to AuthService
// Keeping for backwards compatibility during transition
import { container } from "../container";
const authService = container.resolve("IAuthService");
export const auth = authService.getAuthInstance();
