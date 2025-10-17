import { ConfirmationStep } from "./steps/confirmation";
import { CustomerInfoStep } from "./steps/customer-info";
import { DateStep } from "./steps/date";
import { ReservationsInfoStep } from "./steps/reservation-info";
import { SpecialNotesStep } from "./steps/special-notes";

export const ReservationSteps = [
  {
    label: "Customer Info",
    component: <CustomerInfoStep />,
  },
  {
    label: "Date",
    component: <DateStep />,
  },
  {
    label: "Reservation Details",
    component: <ReservationsInfoStep />,
  },
  {
    label: "Special Notes",
    component: <SpecialNotesStep />,
  },
  {
    label: "Confirmation",
    component: <ConfirmationStep />,
  },
];
