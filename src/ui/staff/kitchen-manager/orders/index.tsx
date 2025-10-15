import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import type { FC } from "react";
import { OrderCard } from "../shared/order-card";
import { OrdersService } from "@/services/staff/kitchen-manager/orders";
import { useQuery } from "@tanstack/react-query";
import { PageLoader } from "../../shared/page-loader";
import { PageError } from "../../shared/page-error";

export const KitchenManager_OrdersPage: FC = () => {
  const [orderType, setOrderType] = useState<"current" | "archived">("current");

  const handleToggle = (
    _: React.SyntheticEvent,
    newValue: "current" | "archived"
  ) => {
    if (newValue) setOrderType(newValue);
  };

  const {
    data: ordersList = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["kitchen-manager_orders"],
    queryFn: () => OrdersService.getAll(),
  });

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="orders list" error={error} />;
  }

  return (
    <>
      {/* Toggle Controls */}
      <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
        <Tabs value={orderType} onChange={handleToggle} centered>
          <Tab value="current" label="Current" />
          <Tab value="archived" label="Archived" />
        </Tabs>
      </Box>

      {orderType === "current" && (
        <Box className="grid grid-cols-2 md:grid-cols-4 gap-6" px={3}>
          {/* New Orders dinein */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto new-orders">
            <Typography
              variant="h5"
              className="sticky top-0 p-4 bg-green-300/60 backdrop-blur z-10 text-black"
            >
              New Dine-In
            </Typography>
            <Grid container spacing={2} ml={6} mr={6} mb={4}>
              {ordersList
                .filter((order) => order.status === "new")
                .map((order) => (
                  <Grid xs={12} md={6} key={order.id}>
                    <OrderCard order={order} />
                  </Grid>
                ))}
            </Grid>
          </Box>

          {/* In Progress dinein */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto in-progress-orders">
            <Typography
              variant="h5"
              className="sticky top-0 p-4 bg-yellow-300/60 backdrop-blur z-10 text-black"
            >
              In Progress Dine-In
            </Typography>
            <Grid container spacing={2} ml={6} mr={6} mb={4}>
              {ordersList
                .filter((order) => order.status === "in-progress")
                .map((order) => (
                  <Grid xs={12} md={6} key={order.id}>
                    <OrderCard order={order} />
                  </Grid>
                ))}
            </Grid>
          </Box>

          {/* New takeaway */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto new-orders">
            <Typography
              variant="h5"
              className="sticky top-0 p-4 bg-green-300/60 backdrop-blur z-10 text-black"
            >
              New Take-Away
            </Typography>
            <Grid container spacing={2} ml={6} mr={6} mb={4}>
              {ordersList
                .filter((order) => order.status === "new")
                .map((order) => (
                  <Grid xs={12} md={6} key={order.id}>
                    <OrderCard order={order} />
                  </Grid>
                ))}
            </Grid>
          </Box>

          {/* In progress takeaway */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto in-progress-orders">
            <Typography
              variant="h5"
              className="sticky top-0 p-4 bg-yellow-300/60 backdrop-blur z-10 text-black"
            >
              In Progress Take-Away
            </Typography>
            <Grid container spacing={2} ml={6} mr={6} mb={4}>
              {ordersList
                .filter((order) => order.status === "in-progress")
                .map((order) => (
                  <Grid xs={12} md={6} key={order.id}>
                    <OrderCard order={order} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>
      )}

      {orderType === "archived" && (
        <Box className="grid grid-cols-1 md:grid-cols-2 gap-6" px={3}>
          {/* Completed */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto completed-orders">
            <Typography
              variant="h5"
              className="sticky top-0 p-4 bg-green-600/60 backdrop-blur z-10 text-black"
            >
              Completed Orders
            </Typography>
            <Grid container spacing={2} ml={6} mr={6} mb={4}>
              {ordersList
                .filter((order) => order.status === "completed")
                .map((order) => (
                  <Grid xs={12} md={6} key={order.id}>
                    <OrderCard order={order} />
                  </Grid>
                ))}
            </Grid>
          </Box>

          {/* Rejected */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto rejected-orders">
            <Typography
              variant="h5"
              className="sticky top-0 p-4 bg-red-300/60 backdrop-blur z-10 text-black"
            >
              Rejected Orders
            </Typography>
            <Grid container spacing={2} ml={6} mr={6} mb={4}>
              {ordersList
                .filter((order) => order.status === "rejected")
                .map((order) => (
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
