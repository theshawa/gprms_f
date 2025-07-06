import type { StaffRole } from "../staff-role";

export interface StaffUser {
  id: number;
  username: string;
  name: string;
  role: StaffRole;
}

export interface StaffAuthState {
  accessToken: string;
  user: StaffUser;
}
