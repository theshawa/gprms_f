import {
  Box,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Grid,
} from "@mui/material";
import { useState } from "react";
import type { FC } from "react";
import "./index.css";
import { OrderCard } from "../shared/order-card";

export const KitchenManagerOrdersPage: FC = () => {
  const [orderType, setOrderType] = useState<"current" | "archived">("current");

  const ordersList = [
    { id: 1, status: "new", item: "Pizza" },
    { id: 2, status: "new", item: "Burger" },
    // Add more mock or real orders as needed
  ];

  const handleToggle = (
    event: React.MouseEvent<HTMLElement>,
    newValue: "current" | "archived" | null
  ) => {
    if (newValue) setOrderType(newValue);
  };

  return (
    <>
      {/* Toggle Controls */}
      <Box className="toggle">
        <ToggleButtonGroup
          value={orderType}
          exclusive
          onChange={handleToggle}
          aria-label="Order Type"
          size="small"
        >
          <ToggleButton value="current">Current</ToggleButton>
          <ToggleButton value="archived">Archived</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Current Orders */}
      {orderType === "current" && (
        <Box className="kitchen-container" px={3}>
          {/* New Orders */}
          <Box className="order-section new-orders">
            <Typography variant="h5" className="section-title">
              New Orders
            </Typography>
            <Grid container spacing={2} className="cards">
              {ordersList.map((order) => (
                <Grid item xs={12} md={6} key={order.id}>
                  <OrderCard />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* In Progress */}
          <Box className="order-section in-progress-orders">
            <Typography variant="h5" className="section-title">
              In Progress
            </Typography>
            <Grid container spacing={2} className="cards">
              {[...Array(6)].map((_, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <OrderCard />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}

      {/* Archived Orders */}
      {orderType === "archived" && (
        <Box className="kitchen-container" px={3}>
          {/* Completed */}
          <Box className="order-section completed-orders">
            <Typography variant="h5" className="section-title">
              Completed Orders
            </Typography>
            <Grid container spacing={2} className="cards">
              {[...Array(4)].map((_, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <OrderCard />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Rejected */}
          <Box className="order-section rejected-orders">
            <Typography variant="h5" className="section-title">
              Rejected Orders
            </Typography>
            <Grid container spacing={2} className="cards">
              {[...Array(3)].map((_, i) => (
                <Grid item xs={12} md={6} key={i}>
                  <OrderCard />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};
