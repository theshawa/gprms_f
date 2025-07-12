import type { DiningTable } from "./dining-table";
import type { StaffUser } from "./staff-user";

export interface DiningArea {
  id: number;
  name: string;
  description: string;
  diningTables: DiningTable[];
  assignedWaiters: StaffUser[];
}
