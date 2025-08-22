import { useCustomerCart } from "@/hooks/useCustomerCart";
import type { Dish } from "@/interfaces/dish";
import { Add, Remove } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  Checkbox,
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

  // Example customization states
  const [size, setSize] = useState("regular"); // radio choice
  const [extras, setExtras] = useState<string[]>([]); // multiple checkboxes

  useEffect(() => {
    if (open) {
      setQty(1);
      setSize("regular");
      setExtras([]);
    }
  }, [open]);

  const toggleExtra = (extra: string) => {
    setExtras((prev) =>
      prev.includes(extra) ? prev.filter((e) => e !== extra) : [...prev, extra]
    );
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm">
      <DialogTitle>
        Select Quantity for <span className="capitalize">{dish.name}</span>
      </DialogTitle>

      <DialogContent>
        {/* Dish details */}
        <Typography variant="subtitle1" gutterBottom color="text.secondary">
          {dish.description}
        </Typography>
        <Typography variant="h6" gutterBottom>
          Rs. {dish.price.toFixed(2)}
        </Typography>

        {/* Quantity Selector */}
        <Stack
          direction="row"
          py={3}
          justifyContent="center"
          alignItems="center"
          spacing={4}
        >
          <IconButton
            color="error"
            size="medium"
            onClick={() => setQty(qty - 1)}
            disabled={qty === 1}
          >
            <Remove />
          </IconButton>
          <Typography variant="h5">{qty}</Typography>
          <IconButton
            color="success"
            size="medium"
            onClick={() => setQty(qty + 1)}
          >
            <Add />
          </IconButton>
        </Stack>

        {/* Customization Options */}
        <Stack spacing={3}>
          {/* Example: Size choice */}
          <FormControl>
            <FormLabel>Size</FormLabel>
            <RadioGroup
              row
              value={size}
              onChange={(e) => setSize(e.target.value)}
            >
              <FormControlLabel
                value="small"
                control={<Radio />}
                label="Small"
              />
              <FormControlLabel
                value="regular"
                control={<Radio />}
                label="Regular"
              />
              <FormControlLabel
                value="large"
                control={<Radio />}
                label="Large"
              />
            </RadioGroup>
          </FormControl>

          {/* Example: Extra add-ons */}
          <FormControl>
            <FormLabel>Add-ons</FormLabel>
            <Stack direction="row" spacing={2}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={extras.includes("cheese")}
                    onChange={() => toggleExtra("cheese")}
                  />
                }
                label="Extra Cheese"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={extras.includes("spicy")}
                    onChange={() => toggleExtra("spicy")}
                  />
                }
                label="Spicy"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={extras.includes("sauce")}
                    onChange={() => toggleExtra("sauce")}
                  />
                }
                label="Extra Sauce"
              />
            </Stack>
          </FormControl>
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
