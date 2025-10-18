import { getBackendErrorMessage } from "@/backend";
import { CustomerReservationService } from "@/services/customer/reservation";
import { Alert, Box, LinearProgress, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { QKs } from "../query-keys";
import { ReservationContext } from "./context";
import { DefaultReservationData, type ReservationData } from "./reservation-data.interface";
import { ReservationStepContent } from "./reservation-step-content";
import { ReservationStepper } from "./reservation-stepper";

export const Customer_Reservations: FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<ReservationData>(DefaultReservationData);

  const {
    data: diningAreas,
    isPending,
    error,
  } = useQuery({
    queryKey: QKs.customer_reservation_dining_areas,
    queryFn: () => CustomerReservationService.getDiningAreas(),
  });

  if (isPending) {
    return (
      <div className="min-h-72 flex items-center justify-center">
        <Box sx={{ width: "100%", maxWidth: "10rem" }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-white py-4  w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Box p={3}>
          <Alert severity="error">
            Failed to load data related to this view: {getBackendErrorMessage(error)}
          </Alert>
        </Box>
      </main>
    );
  }

  if (!diningAreas?.length) {
    return (
      <main className="min-h-screen bg-white py-4  w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Box p={3}>
          <Alert severity="warning">
            No dining areas are available for reservations at the moment. Please try again later.
          </Alert>
        </Box>
      </main>
    );
  }

  return (
    <ReservationContext.Provider
      value={{
        currentStep,
        setCurrentStep,
        data,
        setData,
        diningAreas,
      }}
    >
      <main className="min-h-screen bg-white py-4  w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Typography variant="h4" component="h1" gutterBottom>
          Make a Reservation
        </Typography>
        <ReservationStepper />
        <ReservationStepContent />
      </main>
    </ReservationContext.Provider>
  );
};
