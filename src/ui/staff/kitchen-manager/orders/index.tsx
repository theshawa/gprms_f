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
      <Box className="fixed right-20 mt-4 z-[11]">
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
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6" px={3}>
          {/* New Orders */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-64px)] overflow-y-auto new-orders">
            <Typography
              variant="h5"
              className="sticky top-0 p-4 bg-white/80 backdrop-blur z-10 text-black"
            >
              New Orders
            </Typography>
            <Grid
              container
              spacing={2}
              ml={6}
              mr={6}
              justifyContent="space-between"
            >
              {ordersList.map((order) => (
                <Grid xs={12} md={6} key={order.id}>
                  <OrderCard order={order} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* In Progress */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-64px)] overflow-y-auto in-progress-orders">
            <Typography
              variant="h5"
              className="sticky top-0 p-4 bg-white/80 backdrop-blur z-10 text-black"
            >
              In Progress
            </Typography>
            <Grid
              container
              spacing={2}
              ml={6}
              mr={6}
              justifyContent="space-between"
            >
              {ordersList.map((order) => (
                <Grid xs={12} md={6} key={order.id}>
                  <OrderCard order={order} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}

      {/* Archived Orders */}
      {orderType === "archived" && (
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6" px={3}>
          {/* Completed */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-64px)] overflow-y-auto completed-orders">
            <Typography
              variant="h5"
              className="sticky top-0 p-4 bg-white/80 backdrop-blur z-10 text-black"
            >
              Completed Orders
            </Typography>
            <Grid
              container
              spacing={2}
              ml={6}
              mr={6}
              justifyContent="space-between"
            >
              {ordersList.map((order) => (
                <Grid xs={12} md={6} key={order.id}>
                  <OrderCard order={order} />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Rejected */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-64px)] overflow-y-auto rejected-orders">
            <Typography
              variant="h5"
              className="sticky top-0 p-4 bg-white/80 backdrop-blur z-10 text-black"
            >
              Rejected Orders
            </Typography>
            <Grid
              container
              spacing={2}
              ml={6}
              mr={6}
              justifyContent="space-between"
            >
              {ordersList.map((order) => (
                <Grid xs={12} md={6} key={order.id}>
                  <OrderCard order={order} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};
