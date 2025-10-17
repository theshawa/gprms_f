import { Meal } from "@/enums/meal";
import type { Dayjs } from "dayjs";
import dayjs from "dayjs";

export interface ReservationData {
  customerName: string;
  customerPhone: string;
  meal: Meal;
  diningAreaId: number;
  noOfSeats: number;
  reservationDate: Dayjs;
  notes: string;
}

export const DefaultReservationData: ReservationData = {
  customerName: "",
  customerPhone: "",
  meal: Meal.Brunch,
  diningAreaId: 0,
  noOfSeats: 1,
  reservationDate: dayjs(),
  notes: "",
};
