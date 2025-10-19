import type { DiningTable } from "./dining-table";
import type { Reservation } from "./reservation";
import type { StaffUser } from "./staff-user";

export interface DiningArea {
  id: number;
  name: string;
  description: string;
  diningTables: DiningTable[];
  assignedWaiters: StaffUser[];
  image: string;

  // reservations
  reservationSeatsCount: number;
  reservations?: Reservation[];
}
