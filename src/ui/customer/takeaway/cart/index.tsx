import { useCustomerTakeAwayCart } from "@/hooks/useCustomerTakeAwayCart";
import { formatCurrency } from "@/utils/currency-format";
import { Delete } from "@mui/icons-material";
import {
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { type FC, useState } from "react";
import { Link } from "react-router-dom";
import { PlaceOrderDialog } from "./place-order-dialog";

export const Customer_TakeAway_CartPage: FC = () => {
  const { cartItems, removeItemFromCart } = useCustomerTakeAwayCart();
  const cartTotal = cartItems.reduce(
    (total, item) => total + item.dish.price * item.quantity,
    0
  );

  const [placeOrderDialogOpen, setPlaceOrderDialogOpen] = useState(false);
  return (
    <main className="py-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "start" }}
        justifyContent={"space-between"}
        mb={4}
        zIndex={10}
      >
        <Stack textAlign={{ xs: "center", md: "left" }}>
          <Typography variant="h4" component="h1">
            Your Take Away Cart
          </Typography>
          <Typography variant="h6" gutterBottom mt={0.5}>
            {cartItems.length ? formatCurrency(cartTotal) : "Cart is empty"}
          </Typography>
        </Stack>
        <Stack
          direction="row"
          spacing={2}
          mt={{ xs: 2, md: 0 }}
          width={{ xs: "100%", md: "340px" }}
        >
          <Button
            variant={cartItems.length ? "text" : "contained"}
            component={Link}
            fullWidth
            to={"/takeaway"}
            size="large"
          >
            Add {cartItems.length ? "More" : ""} Items
          </Button>
          <Button
            disabled={!cartItems.length}
            size="large"
            fullWidth
            variant="contained"
            onClick={() => setPlaceOrderDialogOpen(true)}
          >
            Place Order
          </Button>
        </Stack>
      </Stack>
      <Stack spacing={3} pb={10}>
        {cartItems.map(({ dish, quantity }) => (
          <Card key={dish.id}>
            <CardContent>
              <Stack
                alignItems={{ xs: "flex-start", md: "center" }}
                direction={{ xs: "column", md: "row" }}
              >
                <Stack width={{ xs: "100%", md: "300px" }} spacing={0.2}>
                  <Typography variant="h6" textTransform={"capitalize"}>
                    {dish.name}
                  </Typography>
                  <Typography variant="subtitle1" textTransform={"capitalize"}>
                    {formatCurrency(dish.price)} each
                  </Typography>
                </Stack>
                <Stack
                  mt={{ xs: 2, md: 0 }}
                  direction={"row"}
                  alignItems="center"
                  justifyContent={"space-between"}
                  ml={"auto"}
                  width={{ xs: "100%", md: "300px" }}
                >
                  <Chip label={`Quantity: ${quantity}`}></Chip>

                  <Typography variant="subtitle2" sx={{ ml: 4 }}>
                    {formatCurrency(quantity * dish.price)}
                  </Typography>
                  <IconButton
                    onClick={() => removeItemFromCart(dish)}
                    color="error"
                    sx={{ ml: 4 }}
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Stack>
      <PlaceOrderDialog
        open={placeOrderDialogOpen}
        handleClose={() => setPlaceOrderDialogOpen(false)}
      />
    </main>
  );
};
