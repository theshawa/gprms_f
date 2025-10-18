import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { CustomerReservationService } from "@/services/customer/reservation";
import { QKs } from "@/ui/customer/query-keys";
import { Button, Stack, Typography } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type FC } from "react";
import { useReservationContext } from "../../context";
import { DefaultReservationData } from "../../reservation-data.interface";
import { VerificationDialog } from "./verification-dialog";

export const ConfirmationStep: FC = () => {
  const { data, diningAreas, setCurrentStep, setData } = useReservationContext();
  const diningArea = diningAreas?.find((area) => area.id === data.diningAreaId);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const queryClient = useQueryClient();

  const { auth } = useCustomerAuth();
  const [placing, setPlacing] = useState(false);

  const { showSuccess, showError } = useAlert();

  const placeOrder = async () => {
    setPlacing(true);
    try {
      if (auth && auth.user.phoneNumber === data.customerPhone) {
        await CustomerReservationService.placeReservation(data);
        showSuccess(
          "Your reservation has been placed successfully! Our staff will contact you soon."
        );
        setData(DefaultReservationData);
        setCurrentStep(0);
        queryClient.invalidateQueries({ queryKey: QKs.customer_reservation_dining_areas });
        return;
      }
      const { data: resData } = await CustomerReservationService.sendReservationVerificationCode(
        data.customerPhone
      );
      if (resData.status.includes("already")) {
        showSuccess(
          "We have already sent a verification code to this phone number. Please check your messages."
        );
      } else {
        showSuccess(`A verification code has been sent to ${data.customerPhone}.`);
      }
      setVerificationOpen(true);
    } catch (error) {
      showError(`Failed to place order: ${getBackendErrorMessage(error)}`);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 xl:gap-20">
        <div className="flex flex-col gap-5">
          <Typography variant="h6" gutterBottom>
            Confirm Your Reservation
          </Typography>
          <div className="grid grid-cols-2 gap-5">
            <Stack p={1} className="border-b border-black/10">
              <Typography variant="overline" color="textSecondary">
                Name
              </Typography>
              <Typography variant="body1">{data.customerName}</Typography>
            </Stack>
            <Stack p={1} className="border-b border-black/10">
              <Typography variant="overline" color="textSecondary">
                Phone Number
              </Typography>
              <Typography variant="body1">{data.customerPhone}</Typography>
            </Stack>
            <Stack p={1} className="border-b border-black/10">
              <Typography variant="overline" color="textSecondary">
                Date
              </Typography>
              <Typography variant="body1">{data.reservationDate.format("MMMM D, YYYY")}</Typography>
            </Stack>
            <Stack p={1} className="border-b border-black/10">
              <Typography variant="overline" color="textSecondary">
                Meal
              </Typography>
              <Typography variant="body1">{data.meal}</Typography>
            </Stack>
            <Stack p={1} className="border-b border-black/10">
              <Typography variant="overline" color="textSecondary">
                Dining Area
              </Typography>
              <Typography variant="body1">{diningArea?.name}</Typography>
            </Stack>
            <Stack p={1} className="border-b border-black/10">
              <Typography variant="overline" color="textSecondary">
                Seats
              </Typography>
              <Typography variant="body1">{data.noOfSeats}</Typography>
            </Stack>
            <Stack p={1} className="border-b border-black/10">
              <Typography variant="overline" color="textSecondary">
                Special Notes
              </Typography>
              <Typography variant="body1">{data.notes || "-"}</Typography>
            </Stack>
          </div>
          <Stack direction={"row"} spacing={2} pt={3}>
            <Button
              onClick={() => {
                setCurrentStep(3);
              }}
              disabled={placing}
              className="w-max"
            >
              Back
            </Button>
            <Button onClick={placeOrder} className="w-max" variant="contained" disabled={placing}>
              {placing ? "Placing..." : "Place Reservation"}
            </Button>
          </Stack>
        </div>
        <img src="/rooftoplounge.jpg" className="w-full aspect-square rounded-2xl" alt="" />
      </div>
      <VerificationDialog open={verificationOpen} handleClose={() => setVerificationOpen(false)} />
    </>
  );
};
