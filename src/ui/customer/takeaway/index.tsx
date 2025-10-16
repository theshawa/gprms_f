import { useCustomerTakeAwayCart } from "@/hooks/useCustomerTakeAwayCart";
import type { Dish } from "@/interfaces/dish";
import { CustomerTakeAwayService } from "@/services/customer/take-away";
import { ArrowCircleRight } from "@mui/icons-material";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { type FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { QKs } from "../query-keys";
import { DishCard } from "./dish-card";

export const Customer_TakeAway: FC = () => {
  const {
    data: dishes,
    isPending,
    error,
  } = useQuery({
    queryKey: QKs.customer_takeaway_dishes,
    queryFn: () => CustomerTakeAwayService.getProducts(),
  });

  const [showingDishes, setShowingDishes] = useState<Dish[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const { cartItems } = useCustomerTakeAwayCart();

  useEffect(() => {
    setShowingDishes([]);
    if (!dishes) return;
    let list = dishes;

    if (searchQuery.trim()) {
      list = dishes.filter(
        (dish) =>
          dish.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (dish.description &&
            dish.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    setShowingDishes(list);
  }, [dishes, searchQuery]);

  return (
    <main className="py-6 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col">
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "end" }}
        justifyContent={"space-between"}
        mb={4}
        zIndex={10}
      >
        <Stack textAlign={{ xs: "center", md: "left" }}>
          <Typography variant="h4" component={"h1"}>
            Take Away
          </Typography>
          <Typography variant="subtitle1" mt={0.5}>
            Order your favorite dishes for take away.
          </Typography>
        </Stack>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          mt={{ xs: 2, md: 0 }}
        >
          {dishes && dishes.length > 0 ? (
            <Box width={{ xs: "100%", md: "400px" }}>
              <TextField
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                label="Search Dishes"
                variant="filled"
                fullWidth
                size="small"
              />
            </Box>
          ) : null}
          {!!cartItems.length && (
            <Button
              component={Link}
              to={"/takeaway/cart"}
              variant="contained"
              endIcon={<ArrowCircleRight />}
            >
              Go to Cart
            </Button>
          )}
        </Stack>
      </Stack>
      {isPending ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error" align="center" mt={4}>
          Error loading dishes
        </Typography>
      ) : !showingDishes.length ? (
        <Typography color="textDisabled" align="center" mt={4}>
          No dishes available at the moment
        </Typography>
      ) : (
        <Grid
          container
          mt={5}
          columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}
          spacing={2}
        >
          {showingDishes.map((dish) => (
            <Grid size={1} key={dish.id}>
              <DishCard dish={dish} />
            </Grid>
          ))}
        </Grid>
      )}
      {!!cartItems.length && (
        <Box py={5} ml={{ xs: 0, md: "auto" }}>
          <Button
            component={Link}
            to={"/takeaway/cart"}
            variant="contained"
            endIcon={<ArrowCircleRight />}
          >
            Go to Cart
          </Button>
        </Box>
      )}
    </main>
  );
};
