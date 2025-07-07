import { staffBackend } from "../backend";
import type { StaffAuthState } from "../interfaces/staff-auth-state";
import type { StaffUser } from "../interfaces/staff-user";

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

  static async getStaffAccounts() {
    const { data } = await staffBackend.get<StaffUser[]>(
      "/admin/staff-members"
    );
    return data;
  }

  static async createStaffAccount(data: Omit<StaffUser, "id">) {
    const { data: createdUser } = await staffBackend.post<StaffUser>(
      "/admin/create-staff-member",
      data
    );
    return createdUser;
  }

  static async updateStaffAccount(data: StaffUser) {
    const { data: updatedUser } = await staffBackend.put<StaffUser>(
      `/admin/update-staff-member/${data.id}`,
      data
    );
    return updatedUser;
  }

  static async deleteStaffAccount(id: number) {
    await staffBackend.delete(`/admin/delete-staff-member/${id}`);
  }
}
