import { staffBackend } from "@/backend";
import type { Reservation } from "@/interfaces/reservation";

export class ReservationsService {
  static async getAll() {
    const { data } = await staffBackend.get<Reservation[]>(
      "/admin/reservations"
    );
    return data;
  }
}
