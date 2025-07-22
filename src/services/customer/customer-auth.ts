import { customerBackend } from "@/backend";
import type { Customer } from "@/interfaces/customer";

export class CustomerAuthService {
  static async login(name: string, phoneNumber: string) {
    const { data } = await customerBackend.post<{ status: string }>("/login", {
      name,
      phoneNumber,
    });
    return data.status;
  }

  static async verifyLoginCode(phoneNumber: string, code: string) {
    const { data } = await customerBackend.post<{
      accessToken: string;
      user: Customer;
    }>("/verify-login-code", {
      phoneNumber,
      code,
    });

    return data;
  }

  static async refreshAuth() {
    const { data } = await customerBackend.post<{
      accessToken: string;
      user: Customer;
    }>("/refresh-auth");

    return data;
  }

  static async logout() {
    await customerBackend.post<{ status: string }>("/logout");
  }
}
