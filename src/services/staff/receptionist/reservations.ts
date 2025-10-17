import { staffBackend } from "@/backend";
import type { Reservation, ReservationFilters, ReservationVerification } from "@/interfaces/reservation";

// Get all reservations with filters
export const getAllReservations = async (filters?: ReservationFilters): Promise<Reservation[]> => {
  const queryParams = new URLSearchParams();
  
  if (filters?.diningAreaId) queryParams.append('diningAreaId', filters.diningAreaId.toString());
  if (filters?.date) queryParams.append('date', filters.date);
  if (filters?.customerName) queryParams.append('customerName', filters.customerName);
  if (filters?.customerPhone) queryParams.append('customerPhone', filters.customerPhone);
  if (filters?.status) queryParams.append('status', filters.status);
  if (filters?.meal) queryParams.append('meal', filters.meal);

  const url = `/receptionist/reservations${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
  
  const response = await staffBackend.get(url);
  return response.data;
};

// Get reservation by code
export const getReservationByCode = async (code: string): Promise<Reservation> => {
  const response = await staffBackend.get(`/receptionist/reservations/code/${code}`);
  return response.data;
};

// Verify reservation with code and optional phone
export const verifyReservation = async (verification: ReservationVerification): Promise<Reservation> => {
  const response = await staffBackend.post('/receptionist/reservations/verify', verification);
  return response.data;
};

// Update reservation status
export const updateReservationStatus = async (
  id: number, 
  status: 'Pending' | 'Cancelled' | 'Completed'
): Promise<Reservation> => {
  const response = await staffBackend.patch(`/receptionist/reservations/${id}/status`, { status });
  return response.data;
};

// Get today's reservations summary
export const getTodaysSummary = async (): Promise<{
  total: number;
  pending: number;
  completed: number;
  cancelled: number;
  byMeal: { [key: string]: number };
  byArea: { [key: string]: number };
}> => {
  const response = await staffBackend.get('/receptionist/reservations/today-summary');
  return response.data;
};