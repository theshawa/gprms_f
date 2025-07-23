import { getCloudinaryImageUrl } from "@/cloudinary";
import type { Dish } from "@/interfaces/dish";
import { formatCurrency } from "@/utils/currency-format";
import {
  Box,
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
  return (
    <>
      {" "}
      <Card>
        {dish.image && (
          <CardMedia
            sx={{ height: 140 }}
            image={getCloudinaryImageUrl(dish.image)}
            title="green iguana"
          />
        )}
        <CardContent>
          <Typography
            gutterBottom
            variant="h6"
            component="div"
            textTransform={"capitalize"}
          >
            {dish.name}
          </Typography>
          <Typography variant="subtitle2" color="primary">
            {formatCurrency(dish.price)}
          </Typography>

          <Box height={40}>
            <Typography variant="body2" mt={3} color="textSecondary">
              {dish.description || "No description available."}
            </Typography>
          </Box>
        </CardContent>
        <CardActions>
          <Button
            onClick={() => setQuantitySelectorDialogOpen(true)}
            fullWidth
            size="small"
            variant="contained"
          >
            Add to Cart
          </Button>
        </CardActions>
      </Card>
      <QuantitySelectorDialog
        open={quantitySelectorDialogOpen}
        onClose={() => setQuantitySelectorDialogOpen(false)}
        dish={dish}
      />
    </>
  );
};
