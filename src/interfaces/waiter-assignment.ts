import type { DiningTable } from "./dining-table";
import type { StaffUser } from "./staff-user";

export interface WaiterAssignment {
  id: number;
  diningTableId: number;
  waiterId: number;
  assignedAt: string;
  diningTable: DiningTable;
  waiter: StaffUser;
}
