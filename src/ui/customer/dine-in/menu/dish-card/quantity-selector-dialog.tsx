import { useCustomerCart } from "@/hooks/useCustomerCart";
import type { Dish } from "@/interfaces/dish";
import { Add, Remove } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { type FC, useEffect, useState } from "react";

export const QuantitySelectorDialog: FC<{
  open: boolean;
  onClose: () => void;
  dish: Dish;
}> = ({ open, onClose, dish }) => {
  const [qty, setQty] = useState(1);
  const { addItemToCart } = useCustomerCart();

  useEffect(() => {
    if (open) {
      setQty(1);
    }
  }, [open]);

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>
        Select Quantity for <span className="capitalize">{dish.name}</span>
      </DialogTitle>
      <DialogContent>
        <Stack
          direction="row"
          py={3}
          justifyContent="space-between"
          spacing={2}
        >
          <IconButton
            color="error"
            size="large"
            onClick={() => setQty(qty - 1)}
            disabled={qty === 1}
          >
            <Remove />
          </IconButton>
          <Typography variant="h4" component="span">
            {qty}
          </Typography>
          <IconButton
            color="success"
            size="large"
            onClick={() => setQty(qty + 1)}
          >
            <Add />
          </IconButton>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            addItemToCart(dish, qty);
            onClose();
          }}
          variant="contained"
        >
          Add to Cart
        </Button>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
