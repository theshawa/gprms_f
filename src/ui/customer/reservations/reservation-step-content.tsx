import { Box } from "@mui/material";
import type { FC } from "react";
import { useReservationContext } from "./context";
import { ReservationSteps } from "./reservation-steps";

export const ReservationStepContent: FC = () => {
  const { currentStep } = useReservationContext();
  return <Box mt={5}>{ReservationSteps[currentStep].component}</Box>;
};
