import type { StaffRole } from "@/enums/staff-role";
import type { WaiterAssignment } from "./waiter-assignment";

export interface StaffUser {
  id: number;
  username: string;
  name: string;
  role: StaffRole;
  assignedDiningAreas?: WaiterAssignment[];
}
