import { Step, StepLabel, Stepper } from "@mui/material";
import type { FC } from "react";
import { useReservationContext } from "./context";
import { ReservationSteps } from "./reservation-steps";

export const ReservationStepper: FC = () => {
  const { currentStep } = useReservationContext();
  return (
    <Stepper
      sx={{
        mt: 5,
        mb: 10,
      }}
      activeStep={currentStep}
    >
      {ReservationSteps.map((step, index) => (
        <Step key={index} active={index === currentStep}>
          <StepLabel>{step.label}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};
