import {
  Box,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import type { FC } from "react";
import { OrderCard } from "../shared/order-card";
import { staffBackend } from "../../../../backend";
import "./index.css";

export const KitchenManager_OrdersPage: FC = () => {
  const [orderType, setOrderType] = useState<"current" | "archived">("current");

  const [ordersList, setOrdersList] = useState<any[]>([]);

  const loadOrders = async () => {
    try {
      const res = await staffBackend.get("/kitchen-manager/orders");
      console.log(res.data);
      setOrdersList(res.data);
    } catch (err) {
      console.error("Failed to fetch orders", err);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleToggle = (
    _: React.MouseEvent<HTMLElement>,
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
                  <OrderCard order={order} />
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
                <Grid key={i}>{/* <OrderCard /> */}</Grid>
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
                <Grid key={i}>{/* <OrderCard /> */}</Grid>
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
                <Grid key={i}>{/* <OrderCard /> */}</Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};
