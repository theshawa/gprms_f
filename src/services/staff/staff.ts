import { staffBackend } from "@/backend";
import type { StaffRole } from "@/enums/staff-role";
import type { StaffActivityLog } from "@/interfaces/staff-activity-log";
import type { StaffAuthState } from "@/interfaces/staff-auth-state";
import type { StaffUser } from "@/interfaces/staff-user";

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

  static async getStaffAccounts(role?: StaffRole) {
    const { data } = await staffBackend.get<StaffUser[]>("/admin/staff", {
      params: { role },
    });
    return data;
  }

  static async createStaffAccount(data: Omit<StaffUser, "id">) {
    const { data: createdUser } = await staffBackend.post<StaffUser>(
      "/admin/staff",
      data
    );
    return createdUser;
  }

  static async updateStaffAccount(data: StaffUser) {
    const { data: updatedUser } = await staffBackend.put<StaffUser>(
      `/admin/staff/${data.id}`,
      data
    );
    return updatedUser;
  }

  static async deleteStaffAccount(id: number) {
    await staffBackend.delete(`/admin/staff/${id}`);
  }

  static async getStaffActivityHistory(
    id: number,
    page: number = 1,
    perPage: number = 10
  ) {
    const { data } = await staffBackend.get<{
      activities: StaffActivityLog[];
      totalCount: number;
    }>(`/admin/staff/activity-logs/${id}`, {
      params: { page, perPage },
    });

    return data;
  }

  static async clearStaffActivityHistory(id: number) {
    await staffBackend.delete(`/admin/staff/activity-logs/${id}`);
  }
}
