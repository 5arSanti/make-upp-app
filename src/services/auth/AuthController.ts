import { AuthService } from "./AuthService";
import { AuthUser, SignInWithOtpDto, AuthSession } from "./types";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    try {
      return await this.authService.getCurrentUser();
    } catch (error) {
      console.error("Controller error getting current user:", error);
      throw error;
    }
  }

  async getCurrentSession(): Promise<AuthSession | null> {
    try {
      return await this.authService.getCurrentSession();
    } catch (error) {
      console.error("Controller error getting current session:", error);
      throw error;
    }
  }

  async signInWithOtp(data: SignInWithOtpDto): Promise<void> {
    try {
      return await this.authService.signInWithOtp(data);
    } catch (error) {
      console.error("Controller error signing in with OTP:", error);
      throw error;
    }
  }

  async signOut(): Promise<void> {
    try {
      return await this.authService.signOut();
    } catch (error) {
      console.error("Controller error signing out:", error);
      throw error;
    }
  }

  onAuthStateChange(callback: (event: string, session: AuthSession | null) => void) {
    return this.authService.onAuthStateChange(callback);
  }
}
