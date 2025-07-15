import type { DiningArea } from "./dining-area";
import type { StaffUser } from "./staff-user";

export interface WaiterAssignment {
  id: number;
  diningAreaId: number;
  waiterId: number;
  assignedAt: string;
  diningArea: DiningArea;
  waiter: StaffUser;
}
