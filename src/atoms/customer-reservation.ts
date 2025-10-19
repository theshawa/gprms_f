import type { Reservation } from "@/services/customer/reservation";
import { atom } from "jotai";


// Current reservation form data
export interface ReservationFormData {
  customerName: string;
  phoneNumber: string;
  reservationDate: string;
  timeSlot: string;
  guestCount: number;
  meal: "Brunch" | "Lunch" | "HighTea" | "Dinner";
  diningAreaId?: number;
  specialRequests?: string;
  occasionType?: string;
  seatingPreference?: string;
}

export const reservationFormAtom = atom<ReservationFormData>({
  customerName: "",
  phoneNumber: "",
  reservationDate: "",
  timeSlot: "",
  guestCount: 1,
  meal: "Dinner",
  diningAreaId: undefined,
  specialRequests: "",
  occasionType: "",
  seatingPreference: "",
});

// Current step in reservation process
export const reservationStepAtom = atom<number>(1);

// Current user's reservations
export const customerReservationsAtom = atom<Reservation[]>([]);

// Loading states
export const reservationLoadingAtom = atom<boolean>(false);