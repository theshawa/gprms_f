import { customerBackend } from "@/backend";
import type { Customer } from "@/interfaces/customer";


export interface CreateReservationRequest {
    phoneNumber: string;
    customerName: string;
    reservationDate: string; // ISO string
    timeSlot: string;
    guestCount: number;
    meal: "Brunch" | "Lunch" | "HighTea" | "Dinner";
    diningAreaId?: number;
    specialRequests?: string;
}

export interface Reservation {
    id: number;
    reservationCode: string;
    customerId: number;
    phoneNumber: string;
    reservationDate: string;
    timeSlot: string;
    guestCount: number;
    meal: string;
    status: "Pending" | "Confirmed" | "Cancelled" | "Completed";
    specialRequests?: string;
    createdAt: string;
    updatedAt: string;
    customer: Customer;
}

export interface ReservationResponse {
  reservation: Reservation;
  message: string;
}

export interface CustomerReservationsResponse {
  customer: Customer | null;
  reservations: {
    upcoming: Reservation[];
    past: Reservation[];
    total: number;
  };
  summary: {
    totalReservations: number;
    upcomingCount: number;
    pastCount: number;
  };
}

export class ReservationService {
  // Create new reservation
  static async createReservation(data: CreateReservationRequest): Promise<ReservationResponse> {
    const { data: response } = await customerBackend.post<ReservationResponse>("/reservation", data);
    return response;
  }

  // Get reservations by phone number
  static async getReservationsByPhone(phoneNumber: string): Promise<CustomerReservationsResponse> {
    const { data } = await customerBackend.get<CustomerReservationsResponse>(`/reservation/phone/${phoneNumber}`);
    return data;
  }

  // Get reservation by ID
  static async getReservationById(id: number): Promise<Reservation> {
    const { data } = await customerBackend.get<Reservation>(`/reservation/${id}`);
    return data;
  }
}