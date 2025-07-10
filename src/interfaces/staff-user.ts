import type { StaffRole } from "@/enums/staff-role";
import type { DiningTable } from "./dining-table";

export interface StaffUser {
  id: number;
  username: string;
  name: string;
  role: StaffRole;
  assignedDiningTables?: DiningTable[];
}
