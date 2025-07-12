import type { DiningArea } from "./dining-area";

export interface DiningTable {
  id: number;
  name: string;
  diningAreaId: number;
  isReservable: boolean;
  maxSeats: number;
  diningArea: DiningArea;
}
