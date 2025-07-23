import { useCustomerCart } from "@/hooks/useCustomerCart";
import { formatCurrency } from "@/utils/currency-format";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  Typography,
} from "@mui/material";
import { type FC, useEffect } from "react";
import { CartDialogItem } from "./cart-item";

export const CartDialog: FC<{ open: boolean; handleClose: () => void }> = ({
  handleClose,
  open,
}) => {
  const { cartItems } = useCustomerCart();

  const subTotal = cartItems.reduce(
    (total, item) => total + item.dish.price * item.quantity,
    0
  );

  useEffect(() => {
    if (cartItems.length === 0) {
      handleClose();
    }
  }, [cartItems]);

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>Cart</DialogTitle>
      <DialogContent>
        <List>
          {cartItems.map((item) => (
            <CartDialogItem item={item} key={item.dish.id} />
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Typography variant="subtitle2" color="info" sx={{ flexGrow: 1 }}>
          Sub Total: {formatCurrency(subTotal)}
        </Typography>
        <Button onClick={handleClose} color="success" variant="contained">
          Confirm Order
        </Button>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
