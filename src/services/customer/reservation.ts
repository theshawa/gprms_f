import { customerBackend } from "@/backend";
import type { DiningArea } from "@/interfaces/dining-area";
import type { ReservationData } from "@/ui/customer/reservations/reservation-data.interface";

export class CustomerReservationService {
  static async getDiningAreas() {
    const { data } = await customerBackend.get<DiningArea[]>("/reservation/dining-areas");
    return data;
  }

  static async verifyPhoneNumberAndPlaceReservation(
    phoneNumber: string,
    code: string,
    reservationData: ReservationData
  ) {
    await customerBackend.post("/reservation/verify-phone-number-and-place-reservation", {
      phoneNumber,
      code,
      reservationData,
    });
  }

  static async placeReservation(reservationData: ReservationData) {
    const { data } = await customerBackend.post("/reservation/place-reservation", reservationData);
    return data;
  }

  static async sendReservationVerificationCode(phoneNumber: string) {
    return await customerBackend.post<{ status: string }>("/reservation/send-verification-code", {
      phoneNumber,
    });
  }
}
