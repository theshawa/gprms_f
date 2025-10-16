import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { type TakeAwayOrder } from "@/interfaces/take-away-order";
import { Box, Grid, Tab, Tabs, Typography } from "@mui/material";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { OrderCard } from "../shared/order-card";
import { useSocketConnection } from "../socket-context";
import { TakeAwayOrderCard } from "./take-away-order-card";

const dummyOrders = [
  {
    id: "order-001",
    orderCode: "ORD001",
    customerName: "John Doe",
    tableNumber: 1,
    status: "new",
    createdAt: "2025-07-23T09:00:00Z",
    items: [
      { name: "Margherita Pizza", quantity: 1 },
      { name: "Iced Tea", quantity: 1 },
    ],
    note: "No onions",
  },
  {
    id: "order-002",
    orderCode: "ORD002",
    customerName: "Jane Smith",
    tableNumber: 2,
    status: "new",
    createdAt: "2025-07-23T09:05:00Z",
    items: [
      { name: "Pasta Carbonara", quantity: 2 },
      { name: "Garlic Bread", quantity: 1 },
    ],
    note: "Medium cheese",
  },
  {
    id: "order-003",
    orderCode: "ORD003",
    customerName: "Bob Brown",
    tableNumber: 3,
    status: "in-progress",
    createdAt: "2025-07-23T08:50:00Z",
    items: [
      { name: "Burger", quantity: 1 },
      { name: "Fries", quantity: 1 },
    ],
    note: "none",
  },
  {
    id: "order-004",
    orderCode: "ORD004",
    customerName: "Alice Green",
    tableNumber: 4,
    status: "in-progress",
    createdAt: "2025-07-23T08:30:00Z",
    items: [
      { name: "Chicken Wrap", quantity: 2 },
      { name: "Smoothie", quantity: 2 },
    ],
    note: "One wrap without mayo",
  },
  {
    id: "order-005",
    orderCode: "ORD005",
    customerName: "Michael White",
    tableNumber: 5,
    status: "completed",
    createdAt: "2025-07-22T17:45:00Z",
    items: [
      { name: "Tuna Sandwich", quantity: 1 },
      { name: "Cola", quantity: 1 },
    ],
  },
  {
    id: "order-006",
    orderCode: "ORD006",
    customerName: "Emily Davis",
    tableNumber: 6,
    status: "completed",
    createdAt: "2025-07-22T16:30:00Z",
    items: [
      { name: "Mushroom Soup", quantity: 2 },
      { name: "Water", quantity: 2 },
    ],
  },
  {
    id: "order-007",
    orderCode: "ORD007",
    customerName: "Chris Johnson",
    tableNumber: 7,
    status: "rejected",
    createdAt: "2025-07-22T15:20:00Z",
    items: [{ name: "Cheesecake", quantity: 1 }],
    note: "Lactose intolerant – canceled",
  },
  {
    id: "order-008",
    orderCode: "ORD008",
    customerName: "Sara Lee",
    tableNumber: 8,
    status: "rejected",
    createdAt: "2025-07-22T15:00:00Z",
    items: [
      { name: "Nachos", quantity: 1 },
      { name: "Lime Soda", quantity: 1 },
    ],
  },
  {
    id: "order-009",
    orderCode: "ORD009",
    customerName: "Tom Holland",
    tableNumber: 9,
    status: "new",
    createdAt: "2025-07-23T09:10:00Z",
    items: [{ name: "Chicken Biryani", quantity: 1 }],
  },
  {
    id: "order-010",
    orderCode: "ORD010",
    customerName: "Nina Patel",
    tableNumber: 10,
    status: "in-progress",
    createdAt: "2025-07-23T08:20:00Z",
    items: [
      { name: "Paneer Tikka", quantity: 1 },
      { name: "Mango Lassi", quantity: 1 },
    ],
  },
  {
    id: "order-011",
    orderCode: "ORD011",
    customerName: "David King",
    tableNumber: 11,
    status: "completed",
    createdAt: "2025-07-21T19:00:00Z",
    items: [
      { name: "Grilled Fish", quantity: 1 },
      { name: "Rice", quantity: 1 },
    ],
  },
  {
    id: "order-012",
    orderCode: "ORD012",
    customerName: "Luna Cross",
    tableNumber: 12,
    status: "new",
    createdAt: "2025-07-23T09:15:00Z",
    items: [
      { name: "French Toast", quantity: 2 },
      { name: "Orange Juice", quantity: 1 },
    ],
  },
];

export const KitchenManager_OrdersPage: FC = () => {
  const [orderType, setOrderType] = useState<"current" | "archived">("current");
  const [allTakeAwayOrders, setAllTakeAwayOrders] = useState<TakeAwayOrder[]>([]);

  const ordersList = dummyOrders;

  const socket = useSocketConnection();

  const { showError } = useAlert();

  useEffect(() => {
    if (!socket) return;

    socket.emit("getTakeAwayOrders");

    socket.on("takeAwayOrdersResults", (orders) => {
      setAllTakeAwayOrders(orders);
    });

    socket.on("takeAwayOrdersResultsError", (err) => {
      showError(`Failed to fetch take away orders: ${getBackendErrorMessage(err)}`);
    });

    socket.on("newTakeAwayOrder", (order: TakeAwayOrder) => {
      setAllTakeAwayOrders((oto) => [order, ...oto]);
    });

    socket.on("takeAwayOrderCancelled", (two: TakeAwayOrder) => {
      setAllTakeAwayOrders((oto) =>
        oto.map((o) => (o.id === two.id ? { ...o, status: "Cancelled" } : o))
      );
    });

    return () => {
      socket.off("takeAwayOrdersResults");
      socket.off("takeAwayOrdersResultsError");
      socket.off("newTakeAwayOrder");
      socket.off("takeAwayOrderCancelled");
    };
  }, [socket]);

  const handleToggle = (_: React.SyntheticEvent, newValue: "current" | "archived") => {
    if (newValue) setOrderType(newValue);
  };

  const updateTakeAwayOrderStatus = async (id: number, status: "Preparing" | "Prepared") => {
    setAllTakeAwayOrders((oto) => oto.map((to) => (to.id === id ? { ...to, status } : to)));
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
              {ordersList
                .filter((order) => order.status === "new")
                .map((order) => (
                  <Grid size={1} key={order.id}>
                    <OrderCard order={order} />
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
              {ordersList
                .filter((order) => order.status === "in-progress")
                .map((order) => (
                  <Grid size={1} key={order.id}>
                    <OrderCard order={order} />
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
                      updateParentStatus={() => updateTakeAwayOrderStatus(order.id, "Preparing")}
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
                      updateParentStatus={() => updateTakeAwayOrderStatus(order.id, "Prepared")}
                      order={order}
                    />
                  </Grid>
                ))}
            </Grid>
          </Box>
        </Box>
      )}

      {orderType === "archived" && (
        <Box className="grid grid-cols-1 md:grid-cols-2">
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
              {ordersList
                .filter((order) => order.status === "completed")
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
              {ordersList
                .filter((order) => order.status === "rejected")
                .map((order) => (
                  <Grid size={1} key={order.id}>
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
