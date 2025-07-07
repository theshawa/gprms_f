import { staffBackend } from "../backend";
import type { StaffAuthState } from "../interfaces/staff-auth-state";

export class StaffService {
  static async login(username: string, password: string) {
    const { data } = await staffBackend.post<StaffAuthState>("/login", {
      username,
      password,
    });

    return data;
  }

  static async refreshAuth() {
    const { data } = await staffBackend.post<StaffAuthState | null>(
      "/refresh-auth"
    );
    return data;
  }

  static async logout() {
    await staffBackend.post("/logout");
  }
}
