import { getCloudinaryImageUrl } from "@/cloudinary";
import { useCustomerCart } from "@/hooks/useCustomerCart";
import type { CartItem } from "@/interfaces/cart-item";
import { formatCurrency } from "@/utils/currency-format";
import { Add, Delete, Remove } from "@mui/icons-material";
import { IconButton, Stack, Typography } from "@mui/material";
import type { FC } from "react";

export const CartDialogItem: FC<{ item: CartItem }> = ({ item }) => {
  const { removeItemFromCart, decreaseItemQuantity, increaseItemQuantity } =
    useCustomerCart();
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      py={1}
      borderBottom={1}
      borderColor={"divider"}
    >
      <Stack direction="row" alignItems="center" spacing={2} width="100%">
        <img
          src={getCloudinaryImageUrl(item.dish.image)}
          className="size-20 object-cover mr-5"
        />
        <Stack flexGrow={1}>
          <Typography variant="h5" className="capitalize">
            {item.dish.name}
          </Typography>
          <Typography variant="subtitle2" color="textSecondary">
            {item.quantity} x {formatCurrency(item.dish.price)}
          </Typography>
        </Stack>
      </Stack>
      <Stack
        direction={"row"}
        alignItems="center"
        spacing={2}
        width={{ sm: "100%", md: "auto" }}
        ml={{ xs: 0, md: 2 }}
        mt={{ xs: 2, md: 0 }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton
            onClick={() => decreaseItemQuantity(item.dish.id)}
            disabled={item.quantity === 1}
          >
            <Remove />
          </IconButton>
          <Typography variant="h6" color="primary">
            {item.quantity}
          </Typography>
          <IconButton onClick={() => increaseItemQuantity(item.dish.id)}>
            <Add />
          </IconButton>
        </Stack>
        <IconButton
          sx={{ ml: "auto" }}
          color="error"
          onClick={() => removeItemFromCart(item.dish.id)}
        >
          <Delete />
        </IconButton>
      </Stack>
    </Stack>
  );
};
