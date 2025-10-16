import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useCustomerTakeAwayCart } from "@/hooks/useCustomerTakeAwayCart";
import { CustomerTakeAwayService } from "@/services/customer/take-away";
import { formatCurrency } from "@/utils/currency-format";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type FormInputs = {
  customerName: string;
  customerPhone: string;
  notes: string;
};

export const PlaceOrderDialog: FC<{
  open: boolean;
  handleClose: () => void;
}> = ({ open, handleClose }) => {
  const { auth } = useCustomerAuth();
  const { cartItems, clearCart } = useCustomerTakeAwayCart();

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<FormInputs>({});

  const { showSuccess, showError } = useAlert();

  const navigate = useNavigate();

  useEffect(() => {
    if (auth) {
      setValue("customerName", auth.user.name);
      setValue("customerPhone", auth.user.phoneNumber.replace("+94", ""));
    }
  }, [auth]);

  const onSubmit = async (input: FormInputs) => {
    try {
      const { customerName, customerPhone, notes } = input;
      const items = cartItems.map((item) => ({
        dishId: item.dish.id,
        quantity: item.quantity,
        priceAtOrder: item.dish.price,
      }));
      await CustomerTakeAwayService.placeOrder(
        customerName,
        customerPhone,
        notes,
        items
      );
      showSuccess(
        "Order placed successfully! Our staff will call you soon. Thank you!"
      );
      reset();
      clearCart();
      handleClose();
      navigate("/takeaway");
    } catch (error) {
      showError(
        `Failed to place order due to an error: ${getBackendErrorMessage(
          error
        )}`
      );
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.dish.price * item.quantity,
    0
  );

  return (
    <Dialog
      component={"form"}
      onSubmit={handleSubmit(onSubmit)}
      open={open}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle>
        <Typography variant="h6">Take Away Order</Typography>
        <Typography variant="body1" color="textSecondary">
          Subtotal is {formatCurrency(cartTotal)}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <TextField
          {...register("customerName", { required: "Name is required" })}
          label="Your Name"
          placeholder="eg: James Phillips"
          margin="dense"
          fullWidth
          variant="filled"
          error={!!errors.customerName}
          helperText={errors.customerName?.message}
        />
        <TextField
          {...register("customerPhone", {
            required: "Phone number is required",
            pattern: {
              value: /^\d{9}$/,
              message:
                "Phone number must be exactly 9 digits. +94 prefix is automatically added.",
            },
          })}
          label="Your Mobile Number"
          margin="dense"
          fullWidth
          placeholder="eg: 7123456789"
          type="tel"
          variant="filled"
          error={!!errors.customerPhone}
          helperText={errors.customerPhone?.message}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">+94</InputAdornment>
              ),
            },
          }}
        />
        <TextField
          {...register("notes")}
          label="Additional Note (Optional)"
          placeholder="eg: Please pack the food carefully."
          margin="dense"
          fullWidth
          variant="filled"
          multiline
          minRows={2}
          error={!!errors.notes}
          helperText={errors.notes?.message}
          sx={{ mb: 3 }}
        />
        <Typography variant="body2" color="textSecondary">
          Our staff will call you to confirm the order and pickup time. Please
          make sure your phone is reachable. Thank you!
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button disabled={isSubmitting} type="submit" variant="contained">
          Place Take Away Order
        </Button>
        <Button
          disabled={isSubmitting}
          type="reset"
          onClick={handleClose}
          color="inherit"
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
