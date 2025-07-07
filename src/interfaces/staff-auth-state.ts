import type { StaffUser } from "./staff-user";

export interface StaffAuthState {
  accessToken: string;
  user: StaffUser;
}
