import { getCloudinaryImageUrl } from "@/cloudinary";
import { useCustomerTakeAwayCart } from "@/hooks/useCustomerTakeAwayCart";
import type { Dish } from "@/interfaces/dish";
import { formatCurrency } from "@/utils/currency-format";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { type FC, useState } from "react";
import { QuantitySelectorDialog } from "./quantity-selector-dialog";

export const DishCard: FC<{ dish: Dish }> = ({ dish }) => {
  const [quantitySelectorDialogOpen, setQuantitySelectorDialogOpen] =
    useState(false);
  const { cartItems, increaseItemQuantity, removeItemFromCart } =
    useCustomerTakeAwayCart();

  const currentQuantity =
    cartItems.find((item) => item.dish.id === dish.id)?.quantity || 0;
  return (
    <>
      <Card
        sx={{
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <CardMedia
          sx={{ height: 140 }}
          image={getCloudinaryImageUrl(dish.image)}
          title={`${dish.name} image`}
        />
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            textTransform={"capitalize"}
          >
            {dish.name}
          </Typography>
          <Typography variant="subtitle1">
            {formatCurrency(dish.price)}
          </Typography>
          <Typography mt={1} variant="body2" sx={{ color: "text.secondary" }}>
            {dish.description}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => {
              if (!currentQuantity) increaseItemQuantity(dish);
              setQuantitySelectorDialogOpen(true);
            }}
            fullWidth
          >
            {currentQuantity > 0 ? `${currentQuantity} in Cart` : "Add To Cart"}
          </Button>
          {currentQuantity > 0 && (
            <Button
              onClick={() => removeItemFromCart(dish)}
              fullWidth
              color="error"
            >
              Remove
            </Button>
          )}
        </CardActions>
      </Card>
      <QuantitySelectorDialog
        open={quantitySelectorDialogOpen}
        handleClose={() => setQuantitySelectorDialogOpen(false)}
        dish={dish}
      />
    </>
  );
};
