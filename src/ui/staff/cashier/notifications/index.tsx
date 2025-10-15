import type { TakeAwayOrder } from "@/interfaces/take-away-order";
import { formatCurrency } from "@/utils/currency-format";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useEffect, useState, type FC } from "react";
import { useSocketConnection } from "../socket-context";
import { NoficationItem } from "./notification-item";

export const Notifications: FC = () => {
  const [noficiations, setNotifications] = useState<any[]>([]);
  const socket = useSocketConnection();
  useEffect(() => {
    if (!socket) return;

    socket.on("newTakeAwayOrder", (order: TakeAwayOrder) => {
      setNotifications((on) => [
        {
          content: `New Take Away Order of ${formatCurrency(order.totalAmount)} placed by ${
            order.customerName
          }(${order.customerPhone})`,
          time: order.createdAt,
        },
        ...on,
      ]);
    });

    socket.on("takeAwayOrderPrepared", (order: TakeAwayOrder) => {
      setNotifications((on) => [
        {
          content: `Ready to pickup the Take Away Order #${order.id} placed by ${order.customerName}(${order.customerPhone})`,
          time: order.createdAt,
        },
        ...on,
      ]);
    });

    return () => {
      socket.off("newTakeAwayOrder");
      socket.off("takeAwayOrderPrepared");
    };
  }, [socket]);
  return (
    <Box
      borderColor={"divider"}
      className="relative flex flex-col overflow-auto border-l w-1/3 lg:w-1/4 xl:w-1/5"
    >
      <Stack
        direction={"row"}
        alignItems={"center"}
        p={1}
        position={"sticky"}
        top={0}
        bgcolor={"background.paper"}
      >
        <Typography variant="caption" color="textSecondary" textTransform={"uppercase"}>
          {Notifications.length || "No"} Notifications
        </Typography>
        {!!noficiations.length && (
          <Button
            sx={{ ml: "auto" }}
            size="small"
            onClick={() => setNotifications([])}
            aria-label="delete"
          >
            Clear All
          </Button>
        )}
      </Stack>
      <Stack direction={"column"} p={2} spacing={3}>
        {noficiations.map((n, i) => (
          <NoficationItem key={i} {...n} />
        ))}
      </Stack>
    </Box>
  );
};
