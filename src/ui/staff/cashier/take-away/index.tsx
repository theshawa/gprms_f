import type { TakeAwayOrder } from "@/interfaces/take-away-order";
import { Stack, Tab, Tabs } from "@mui/material";
import { type FC, useEffect, useState } from "react";
import { useCashierSocketConnection } from "../socket-context";

export const Cashier_TakeAwayPage: FC = () => {
  const socket = useCashierSocketConnection();
  const [orders, setOrders] = useState<TakeAwayOrder[]>([]);
  const [tab, setTab] = useState(1);

  useEffect(() => {
    if (!socket) return;

    const status =
      tab === 1
        ? ["New"]
        : tab === 2
        ? ["Preparing"]
        : tab === 3
        ? ["Prepared"]
        : ["Completed", "Rejected"];

    socket.emit("getTakeAwayOrders", status);

    socket.on("takeAwayOrdersResults", (orders: TakeAwayOrder[]) => {
      setOrders(orders);
    });

    return () => {
      socket.off("takeAwayOrdersResults");
    };
  }, [socket, tab]);

  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      height={"calc(100vh - var(--header-height))"}
      position={"sticky"}
      top={0}
    >
      <Stack overflow={"auto"} flex={2} gap={2}>
        <Tabs
          variant="fullWidth"
          value={tab}
          onChange={(_, newValue) => setTab(newValue)}
          aria-label="basic tabs example"
        >
          <Tab label={"New"} value={1} />
          <Tab label={"Preparing"} value={2} />
          <Tab label={"Prepared"} value={3} />
          <Tab label={"History"} value={4} />
        </Tabs>
        {JSON.stringify(orders)}
      </Stack>
      <Stack flex={1} p={3} bgcolor={"divider"}>
        Order Preview
      </Stack>
    </Stack>
  );
};
