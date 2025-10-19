import { staffBackend } from "@/backend";
import type { ReservationFilters } from "@/interfaces/reservation";

interface PaginationParams {
  page?: number;
  limit?: number;
}

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export class ReceptionistReservationsService {
  static async getAll(filters?: ReservationFilters & PaginationParams) {
    const queryParams = new URLSearchParams();

    if (filters?.page) queryParams.append("page", filters.page.toString());
    if (filters?.limit) queryParams.append("limit", filters.limit.toString());
    if (filters?.diningAreaId) queryParams.append("diningAreaId", filters.diningAreaId.toString());
    if (filters?.date) queryParams.append("date", filters.date);
    if (filters?.customerName) queryParams.append("customerName", filters.customerName);
    if (filters?.customerPhone) queryParams.append("customerPhone", filters.customerPhone);
    if (filters?.status) queryParams.append("status", filters.status);
    if (filters?.meal) queryParams.append("meal", filters.meal);

    const url = `/receptionist/reservations${
      queryParams.toString() ? `?${queryParams.toString()}` : ""
    }`;

    const response = await staffBackend.get<PaginatedResponse<any>>(url);
    return response.data;
  }

  static async completeReservation(reservationId: number) {
    const response = await staffBackend.post<{ success: boolean }>(
      `/receptionist/reservations/complete/${reservationId}`
    );
    return response.data;
  }

  static async cancelReservation(reservationId: number) {
    const response = await staffBackend.post<{ success: boolean }>(
      `/receptionist/reservations/cancel/${reservationId}`
    );
    return response.data;
  }
}
