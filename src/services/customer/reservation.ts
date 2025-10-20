import { customerBackend } from "@/backend";
import type { Customer } from "@/interfaces/customer";
import type { DiningArea } from "@/interfaces/dining-area";
import type { ReservationData } from "@/ui/customer/reservations/reservation-data.interface";

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
  static async createReservation(
    data: CreateReservationRequest
  ): Promise<ReservationResponse> {
    const { data: response } = await customerBackend.post<ReservationResponse>(
      "/reservation",
      data
    );
    return response;
  }

  // Get reservations by phone number
  static async getReservationsByPhone(
    phoneNumber: string
  ): Promise<CustomerReservationsResponse> {
    const { data } = await customerBackend.get<CustomerReservationsResponse>(
      `/reservation/phone/${phoneNumber}`
    );
    return data;
  }

  // Get reservation by ID
  static async getReservationById(id: number): Promise<Reservation> {
    const { data } = await customerBackend.get<Reservation>(
      `/reservation/${id}`
    );
    return data;
  }
}

export interface ClosedDay {
  id: number;
  date: string;
  startTime: string | null;
  endTime: string | null;
  isFullDay: boolean;
  reason: string;
  description: string | null;
}

export class CustomerReservationService {
  static async getDiningAreas() {
    const { data } = await customerBackend.get<DiningArea[]>(
      "/reservation/dining-areas"
    );
    return data;
  }

  static async getClosedDays() {
    const { data } = await customerBackend.get<{
      success: boolean;
      data: ClosedDay[];
    }>("/reservation/closed-days");
    return data.data;
  }

  static async verifyPhoneNumberAndPlaceReservation(
    phoneNumber: string,
    code: string,
    reservationData: ReservationData
  ) {
    await customerBackend.post(
      "/reservation/verify-phone-number-and-place-reservation",
      {
        phoneNumber,
        code,
        reservationData,
      }
    );
  }

  static async placeReservation(reservationData: ReservationData) {
    const { data } = await customerBackend.post(
      "/reservation/place-reservation",
      reservationData
    );
    return data;
  }

  static async sendReservationVerificationCode(phoneNumber: string) {
    return await customerBackend.post<{ status: string }>(
      "/reservation/send-verification-code",
      {
        phoneNumber,
      }
    );
  }
}
