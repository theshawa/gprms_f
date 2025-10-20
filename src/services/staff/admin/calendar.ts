import { staffBackend } from "@/backend";

export interface CalendarReservation {
  id: number;
  reservationCode: string;
  customerName: string;
  customerPhone: string;
  meal: "Brunch" | "Lunch" | "HighTea" | "Dinner";
  diningAreaId: number;
  diningArea: {
    id: number;
    name: string;
    description: string;
    image: string;
    reservationSeatsCount: number;
  };
  noOfSeats: number;
  reservationDate: string;
  status: "Pending" | "Cancelled" | "Completed";
  notes: string;
  createdAt: string;
}

export interface ClosedDay {
  id: number;
  date: string;
  startTime: string | null;
  endTime: string | null;
  isFullDay: boolean;
  reason: string;
  description: string | null;
  createdById: number;
  createdBy: {
    id: number;
    name: string;
    username: string;
  };
  createdAt: string;
}

export interface CreateClosedDayPayload {
  date: string;
  startTime?: string;
  endTime?: string;
  isFullDay: boolean;
  reason: string;
  description?: string;
}

export interface CreateClosedDaysRangePayload {
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  isFullDay: boolean;
  reason: string;
  description?: string;
}

export class CalendarService {
  static async getReservationsByDate(date: string): Promise<CalendarReservation[]> {
    try {
      console.log("=== CalendarService.getReservationsByDate ===");
      console.log("Fetching reservations for date:", date);
      console.log("Full URL:", `/admin/calendar/reservations?date=${date}`);
      
      const res = await staffBackend.get<{ success: boolean; data: CalendarReservation[] }>(
        `/admin/calendar/reservations?date=${date}`
      );
      
      console.log("Reservations response status:", res.status);
      console.log("Reservations response data:", res.data);
      console.log("Number of reservations:", res.data?.data?.length || 0);
      
      if (!res.data || !res.data.data) {
        console.error("Invalid response structure:", res.data);
        return [];
      }
      
      console.log("Returning reservations:", res.data.data);
      return res.data.data;
    } catch (error: any) {
      console.error("=== Error fetching reservations ===");
      console.error("Error message:", error.message);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      throw error;
    }
  }

  static async getClosedDays(): Promise<ClosedDay[]> {
    const res = await staffBackend.get<{ success: boolean; data: ClosedDay[] }>(
      "/admin/calendar/closed-days"
    );
    return res.data.data;
  }

  static async createClosedDay(payload: CreateClosedDayPayload): Promise<ClosedDay> {
    const res = await staffBackend.post<{ success: boolean; data: ClosedDay }>(
      "/admin/calendar/closed-days",
      payload
    );
    return res.data.data;
  }

  static async createClosedDaysRange(payload: CreateClosedDaysRangePayload): Promise<ClosedDay[]> {
    const res = await staffBackend.post<{ success: boolean; data: ClosedDay[] }>(
      "/admin/calendar/closed-days/range",
      payload
    );
    return res.data.data;
  }

  static async deleteClosedDay(id: number): Promise<void> {
    await staffBackend.delete(`/admin/calendar/closed-days/${id}`);
  }
}
