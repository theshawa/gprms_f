import type { StaffRole } from "@/enums/staff-role";

export interface StaffUser {
  id: number;
  username: string;
  name: string;
  role: StaffRole;
}
