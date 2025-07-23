import { getNameForMeal } from "@/enums/meal";
import { useCustomerCart } from "@/hooks/useCustomerCart";
import { Box, Chip, Grid, Paper, Typography } from "@mui/material";
import { type FC, useContext } from "react";
import { useParams } from "react-router-dom";
import { BottomBar } from "../bottom-bar";
import { Customer_DineInContext } from "../context";
import { DishCard } from "./dish-card";

export const Customer_DineInMenuPage: FC = () => {
  const tableId = useParams<{ tableId: string }>().tableId!;
  const { cartItems } = useCustomerCart();

  const data = useContext(Customer_DineInContext);

  if (!data) {
    return null;
  }

  return (
    <>
      <Paper sx={{ p: 3, mb: 5 }}>
        <Box borderBottom={1} borderColor="divider" mb={4}>
          <Chip
            size="small"
            label={`Table: ${data.diningTable.name}`}
            color="info"
          />
          <Chip
            label={"Meal: " + getNameForMeal(data.menu.meal)}
            size="small"
            sx={{ ml: 1 }}
            color="primary"
          />
          <Typography
            variant="h4"
            sx={{ mt: 4, mb: 1 }}
            textTransform="capitalize"
          >
            {data.menu.name}
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" sx={{ mb: 2 }}>
            {data.menu.description}
          </Typography>
        </Box>
        {data.menu.menuSections.map((section) => (
          <Box key={section.id} mb={4}>
            <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
              {section.name}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {section.description}
            </Typography>
            <Grid
              container
              columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
              spacing={2}
              mt={4}
            >
              {section.menuItems.map((item) => (
                <Grid key={item.id} size={1}>
                  <DishCard dish={item.dish} />
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Paper>
      <BottomBar
        next={
          cartItems.length > 0
            ? {
                name: "Confirm Order",
                link: `/dine-in/${tableId}/confirm`,
              }
            : undefined
        }
      />
    </>
  );
};
