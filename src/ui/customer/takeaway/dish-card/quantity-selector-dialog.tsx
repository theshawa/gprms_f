import { useCustomerTakeAwayCart } from "@/hooks/useCustomerTakeAwayCart";
import type { Dish } from "@/interfaces/dish";
import { formatCurrency } from "@/utils/currency-format";
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
import { type FC } from "react";

export const QuantitySelectorDialog: FC<{
  open: boolean;
  handleClose: () => void;
  dish: Dish;
}> = ({ open, handleClose, dish }) => {
  const { cartItems, increaseItemQuantity, decreaseItemQuantity } =
    useCustomerTakeAwayCart();

  const currentQuantity =
    cartItems.find((item) => item.dish.id === dish.id)?.quantity || 0;

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>
        <Typography variant="h6" textTransform={"capitalize"}>
          {dish.name}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Typography variant="subtitle2" textAlign={"center"}>
          Select Quantity
        </Typography>

        {/* Quantity Selector */}
        <Stack
          direction="row"
          py={3}
          alignItems="center"
          justifyContent={"space-between"}
          spacing={4}
        >
          <IconButton
            size="large"
            onClick={() => decreaseItemQuantity(dish)}
            disabled={currentQuantity < 1}
          >
            <Remove />
          </IconButton>
          <Typography variant="h4">{currentQuantity}</Typography>
          <IconButton
            color="success"
            size="large"
            onClick={() => increaseItemQuantity(dish)}
          >
            <Add />
          </IconButton>
        </Stack>
        <Typography variant="subtitle1" textAlign={"center"}>
          {formatCurrency(dish.price)} x {currentQuantity} ={" "}
          <span className="font-medium">
            {formatCurrency(currentQuantity * dish.price)}
          </span>
        </Typography>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="inherit">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
