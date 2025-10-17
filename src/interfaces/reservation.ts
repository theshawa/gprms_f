import { Meal } from "@/enums/meal";

export enum ReservationStatus {
  Pending = "Pending",
  Cancelled = "Cancelled", 
  Completed = "Completed"
}

export interface Reservation {
  id: number;
  reservationCode: string;
  customerName: string;
  customerPhone: string;
  meal: Meal;
  diningAreaId: number;
  diningArea?: {
    id: number;
    name: string;
    description?: string;
  };
  noOfSeats: number;
  reservationDate: Date | string;
  status: ReservationStatus;
  notes: string;
  createdAt: Date | string;
}

export interface ReservationFilters {
  diningAreaId?: number;
  date?: string;
  customerName?: string;
  customerPhone?: string;
  status?: ReservationStatus;
  meal?: Meal;
}

export interface ReservationVerification {
  reservationCode: string;
  customerPhone?: string;
}