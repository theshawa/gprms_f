import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { type TakeAwayOrder } from "@/interfaces/take-away-order";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { OrderCard } from "./order-card";
import { useSocketConnection } from "../socket-context";
import { TakeAwayOrderCard } from "./take-away-order-card";
import type { Order } from "@/interfaces/orders";

export const KitchenManager_OrdersPage: FC = () => {
  const [orderType, setOrderType] = useState<"current" | "archived">("current");
  const [allTakeAwayOrders, setAllTakeAwayOrders] = useState<TakeAwayOrder[]>(
    []
  );
  const [allDineInOrders, setAllDineInOrders] = useState<Order[]>([]);

  const socket = useSocketConnection();

  const { showError } = useAlert();

  useEffect(() => {
    if (!socket) return;

    socket.emit("getTakeAwayOrders");

    socket.on("takeAwayOrdersResults", (orders) => {
      setAllTakeAwayOrders(orders);
    });

    socket.on("takeAwayOrdersResultsError", (err) => {
      showError(
        `Failed to fetch take away orders: ${getBackendErrorMessage(err)}`
      );
    });

    socket.on("newTakeAwayOrder", (order: TakeAwayOrder) => {
      setAllTakeAwayOrders((oto) => [order, ...oto]);
    });

    socket.on("takeAwayOrderCancelled", (two: TakeAwayOrder) => {
      setAllTakeAwayOrders((oto) =>
        oto.map((o) => (o.id === two.id ? { ...o, status: "Cancelled" } : o))
      );
    });

    socket.emit("getDineInOrders");

    socket.on("dineInOrdersResults", (orders) => {
      setAllDineInOrders(orders);
    });

    socket.on("dineInOrdersError", (err) => {
      showError(
        `Failed to fetch dine in orders: ${getBackendErrorMessage(err)}`
      );
    });

    socket.on("newDineInOrder", (order: Order) => {
      setAllDineInOrders((prev) => [order, ...prev]);
    });

    socket.on("dineInOrderStatusChanged", (updated: Order) => {
      setAllDineInOrders((prev) =>
        prev.map((o) => (o.id === updated.id ? updated : o))
      );
    });

    return () => {
      socket.off("takeAwayOrdersResults");
      socket.off("takeAwayOrdersResultsError");
      socket.off("newTakeAwayOrder");
      socket.off("takeAwayOrderCancelled");
      socket.off("dineInOrdersResults");
      socket.off("dineInOrdersError");
      socket.off("newDineInOrder");
      socket.off("dineInOrderStatusChanged");
    };
  }, [socket]);

  const handleToggle = (
    _: React.SyntheticEvent,
    newValue: "current" | "archived"
  ) => {
    if (newValue) setOrderType(newValue);
  };

  const updateTakeAwayOrderStatus = async (
    id: number,
    status: "Preparing" | "Prepared"
  ) => {
    setAllTakeAwayOrders((oto) =>
      oto.map((to) => (to.id === id ? { ...to, status } : to))
    );
  };

  const updateOrderStatus = async (
    id: number,
    status: "InProgress" | "Ready"
  ) => {
    setAllDineInOrders((oto) =>
      oto.map((to) => (to.id === id ? { ...to, status } : to))
    );
  };

  return (
    <>
      {/* Toggle Controls */}
      <Box sx={{ width: "100%", borderBottom: 1, borderColor: "divider" }}>
        <Tabs variant="fullWidth" value={orderType} onChange={handleToggle}>
          <Tab value="current" label="Current" />
          <Tab value="archived" label="Archived" />
        </Tabs>
      </Box>

      {orderType === "current" && (
        <Box className="grid grid-cols-2 md:grid-cols-4">
          {/* New Orders dinein */}
          <Box
            borderRight={1}
            borderColor={"divider"}
            className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto new-orders"
          >
            <Typography
              bgcolor={"background.paper"}
              borderBottom={1}
              borderColor={"divider"}
              variant="subtitle1"
              className="sticky top-0 p-2 z-10 text-black"
            >
              New Dine In
            </Typography>
            <Grid container spacing={2} columns={1} p={2}>
              {allDineInOrders
                .filter((order) => order.status === "New")
                .map((order) => (
                  <Grid size={1} key={order.id}>
                    <OrderCard
                      updateParentStatus={() =>
                        updateOrderStatus(order.id, "InProgress")
                      }
                      order={order}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>

          {/* In Progress dinein */}
          <Box
            borderRight={1}
            borderColor={"divider"}
            className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto in-progress-orders"
          >
            <Typography
              bgcolor={"background.paper"}
              borderBottom={1}
              borderColor={"divider"}
              variant="subtitle1"
              className="sticky top-0 p-2 z-10 text-black"
            >
              Preparing Dine-In
            </Typography>
            <Grid container spacing={2} columns={1} p={2}>
              {allDineInOrders
                .filter((order) => order.status === "InProgress")
                .map((order) => (
                  <Grid size={1} key={order.id}>
                    <OrderCard
                      updateParentStatus={() =>
                        updateOrderStatus(order.id, "Ready")
                      }
                      order={order}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>

          {/* New takeaway */}
          <Box
            borderRight={1}
            borderColor={"divider"}
            className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto new-orders"
          >
            <Typography
              bgcolor={"background.paper"}
              borderBottom={1}
              borderColor={"divider"}
              variant="subtitle1"
              className="sticky top-0 p-2 z-10 text-black"
            >
              New Take Away
            </Typography>
            <Grid container spacing={2} columns={1} p={2}>
              {allTakeAwayOrders
                .filter((order) => order.status === "New")
                .map((order) => (
                  <Grid size={1} key={order.id}>
                    <TakeAwayOrderCard
                      updateParentStatus={() =>
                        updateTakeAwayOrderStatus(order.id, "Preparing")
                      }
                      order={order}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>

          {/* In progress takeaway */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto in-progress-orders">
            <Typography
              bgcolor={"background.paper"}
              borderBottom={1}
              borderColor={"divider"}
              variant="subtitle1"
              className="sticky top-0 p-2 z-10 text-black"
            >
              Preparing Take Away
            </Typography>
            <Grid container columns={1} p={2} spacing={2}>
              {allTakeAwayOrders
                .filter((order) => order.status === "Preparing")
                .map((order) => (
                  <Grid size={1} key={order.id}>
                    <TakeAwayOrderCard
                      updateParentStatus={() =>
                        updateTakeAwayOrderStatus(order.id, "Prepared")
                      }
                      order={order}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>
      )}

      {orderType === "archived" && (
        <Box className="grid grid-cols-2 md:grid-cols-4">
          {/* Completed */}
          <Box
            borderRight={1}
            borderColor={"divider"}
            className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto completed-orders"
          >
            <Typography
              bgcolor={"background.paper"}
              borderBottom={1}
              borderColor={"divider"}
              variant="subtitle1"
              className="sticky top-0 p-2 z-10 text-black"
            >
              Completed Orders
            </Typography>
            <Grid container spacing={2} columns={2} p={2}>
              {allDineInOrders
                .filter((order) => order.status === "Completed")
                .map((order) => (
                  <Grid size={1} key={order.id}>
                    <OrderCard order={order} />
                  </Grid>
                ))}
            </Grid>
          </Box>

          {/* Rejected */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto rejected-orders">
            <Typography
              bgcolor={"background.paper"}
              borderBottom={1}
              borderColor={"divider"}
              variant="subtitle1"
              className="sticky top-0 p-2 z-10 text-black"
            >
              Rejected Orders
            </Typography>
            <Grid container spacing={2} columns={2} p={2}>
              {allDineInOrders
                .filter((order) => order.status === "Rejected")
                .map((order) => (
                  <Grid size={1} key={order.id}>
                    <OrderCard order={order} />
                  </Grid>
                ))}
            </Grid>
          </Box>

          {/* Takeaway Completed */}
          <Box
            borderRight={1}
            borderColor={"divider"}
            className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto completed-orders"
          >
            <Typography
              bgcolor={"background.paper"}
              borderBottom={1}
              borderColor={"divider"}
              variant="subtitle1"
              className="sticky top-0 p-2 z-10 text-black"
            >
              Completed TakeAway Orders
            </Typography>
            <Grid container spacing={2} columns={2} p={2}>
              {allTakeAwayOrders
                .filter((order) => order.status === "Completed")
                .map((order) => (
                  <Grid size={1} key={order.id}>
                    <TakeAwayOrderCard order={order} />
                  </Grid>
                ))}
            </Grid>
          </Box>

          {/* Takeaway Rejected */}
          <Box className="flex flex-col gap-5 max-h-[calc(100vh-130px)] overflow-y-auto rejected-orders">
            <Typography
              bgcolor={"background.paper"}
              borderBottom={1}
              borderColor={"divider"}
              variant="subtitle1"
              className="sticky top-0 p-2 z-10 text-black"
            >
              Rejected TakeAway Orders
            </Typography>
            <Grid container spacing={2} columns={2} p={2}>
              {allTakeAwayOrders
                .filter((order) => order.status === "Cancelled")
                .map((order) => (
                  <Grid size={1} key={order.id}>
                    <TakeAwayOrderCard order={order} />
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>
      )}
    </>
  );
};
