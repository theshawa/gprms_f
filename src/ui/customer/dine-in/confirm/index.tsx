import { getCloudinaryImageUrl } from "@/cloudinary";
import { getNameForMeal } from "@/enums/meal";
import { useCustomerCart } from "@/hooks/useCustomerCart";
import { formatCurrency } from "@/utils/currency-format";
import { Add, Delete, Remove } from "@mui/icons-material";
import { Chip, IconButton, Paper, Stack, Typography } from "@mui/material";
import { type FC, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { BottomBar } from "../bottom-bar";
import { Customer_DineInContext } from "../context";

export const Customer_DineInConfirm: FC = () => {
  const tableId = useParams<{ tableId: string }>().tableId!;
  const {
    cartItems,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeItemFromCart,
  } = useCustomerCart();

  const data = useContext(Customer_DineInContext);

  const navigate = useNavigate();

  const subTotal = cartItems.reduce((total, item) => {
    return total + item.dish.price * item.quantity;
  }, 0);

  if (!data) {
    return null;
  }

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate(`/dine-in/${tableId}`);
    }
  }, [cartItems]);

  return (
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Confirm Your Order
      </Typography>
      <Paper sx={{ p: 3, mb: 5 }}>
        <Typography variant="overline" component="h2" color="primary" mb={3}>
          Order Summary
        </Typography>
        <Chip label={`Table: ${tableId}`} />
        <Chip label={getNameForMeal(data.menu.meal)} sx={{ ml: 1 }} />
        <Typography variant="subtitle1" component="h2" gutterBottom mt={2}>
          Sub Total:{" "}
          <Typography component="span" fontWeight="bold">
            {formatCurrency(subTotal)}
          </Typography>
        </Typography>
      </Paper>
      <Paper sx={{ p: 3, mb: 5 }}>
        <Typography variant="overline" component="h2" color="primary" mb={3}>
          Selected Dishes
        </Typography>
        {cartItems.map((item) => (
          <Stack
            direction={{ xs: "column", sm: "row" }}
            key={item.dish.id}
            spacing={2}
          >
            <Stack direction={"row"} spacing={2} flexGrow={1}>
              <img
                src={getCloudinaryImageUrl(item.dish.image)}
                alt={item.dish.name}
                className="size-24 object-cover"
              />
              <Stack>
                <Typography variant="h6" textTransform={"capitalize"}>
                  {item.dish.name}
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {formatCurrency(item.dish.price)} x {item.quantity} ={" "}
                  <Typography component="span" fontWeight="bold">
                    {formatCurrency(item.dish.price * item.quantity)}
                  </Typography>
                </Typography>
              </Stack>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={2}
                flexGrow={1}
              >
                <IconButton
                  onClick={() => decreaseItemQuantity(item.dish.id)}
                  disabled={item.quantity <= 1}
                >
                  <Remove />
                </IconButton>
                <Typography variant="h6" textTransform={"capitalize"}>
                  {item.quantity}
                </Typography>
                <IconButton onClick={() => increaseItemQuantity(item.dish.id)}>
                  <Add />
                </IconButton>
              </Stack>
              <IconButton
                onClick={() => removeItemFromCart(item.dish.id)}
                color="error"
                size="large"
              >
                <Delete />
              </IconButton>
            </Stack>
          </Stack>
        ))}
      </Paper>
      <BottomBar
        previous={{
          name: "Back to Menu",
          link: `/dine-in/${tableId}`,
        }}
        next={{
          name: "Confirm Order",
          link: `/dine-in/${tableId}/status`,
        }}
      />
    </>
  );
};
