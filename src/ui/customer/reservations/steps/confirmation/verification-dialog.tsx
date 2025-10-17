import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { CustomerReservationService } from "@/services/customer/reservation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from "@mui/material";
import { type FC } from "react";
import { useForm } from "react-hook-form";
import { useReservationContext } from "../../context";
import { DefaultReservationData } from "../../reservation-data.interface";

export const VerificationDialog: FC<{ open: boolean; handleClose: () => void }> = ({
  handleClose,
  open,
}) => {
  const {
    handleSubmit,
    formState: { errors, isSubmitting },
    register,
    reset,
  } = useForm<{ code: string }>();

  const { data, setCurrentStep, setData } = useReservationContext();

  const { showSuccess, showError } = useAlert();

  const onSubmit = async ({ code }: { code: string }) => {
    try {
      await CustomerReservationService.verifyPhoneNumberAndPlaceReservation(
        data.customerPhone,
        code,
        data
      );

      showSuccess(
        `Your reservation has been placed successfully, ${data.customerName}! Our staff will contact you soon.`
      );

      setData(DefaultReservationData);
      setCurrentStep(0);
      reset();
      handleClose();
    } catch (error) {
      showError(`Failed to verify due to an error: ${getBackendErrorMessage(error)}`);
    }
  };
  return (
    <Dialog open={open}>
      <DialogTitle>Verify Your Phone Number and Place Reservation</DialogTitle>
      <DialogContent>
        <Typography variant="body1">
          Please enter the verification code sent to your phone.
        </Typography>
        <form id="form" onSubmit={handleSubmit(onSubmit)}>
          <TextField
            {...register("code", {
              required: "Verification code is required",
              pattern: {
                value: /^\d{6}$/,
                message: "Verification code must be exactly 6 digits",
              },
            })}
            label="Verification Code"
            placeholder="Enter 6-digit code"
            margin="dense"
            fullWidth
            variant="filled"
            error={!!errors.code}
            helperText={errors.code?.message}
          />
        </form>
      </DialogContent>
      <DialogActions>
        <Button type="submit" form="form" variant="contained" disabled={isSubmitting}>
          {isSubmitting ? "Verifying..." : "Verify"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
