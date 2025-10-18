import type { DiningArea } from "@/interfaces/dining-area";
import type { SetStateAction } from "jotai";
import { createContext, useContext, type Dispatch } from "react";
import { DefaultReservationData, type ReservationData } from "./reservation-data.interface";

export const ReservationContext = createContext<{
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
  data: ReservationData;
  setData: Dispatch<SetStateAction<ReservationData>>;
  diningAreas: DiningArea[];
}>({
  currentStep: 0,
  setCurrentStep: () => {},
  data: DefaultReservationData,
  setData: () => {},
  diningAreas: [],
});

export const useReservationContext = () => useContext(ReservationContext);
