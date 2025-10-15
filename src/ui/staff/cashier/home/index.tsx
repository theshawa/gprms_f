import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import type { TakeAwayOrder } from "@/interfaces/take-away-order";
import { Box, Stack, Tab, Tabs, TextField, Typography } from "@mui/material";
import { useEffect, useState, type FC } from "react";
import { useSocketConnection } from "../socket-context";
import { TakeAwayOrderItem } from "./take-away-order-item";
import { TakeAwayOrderPreview } from "./take-away-order-preview";

export const Cashier_HomePage: FC = () => {
  const [tab, setTab] = useState<
    "active-dine-in" | "active-take-away" | "past-dine-in" | "past-take-away"
  >("active-take-away");
  const [allTakeAwayOrders, setAllTakeAwayOrders] = useState<TakeAwayOrder[]>([]);
  const [allDineInOrders, setAllDineInOrders] = useState<any[]>([]);
  const [showingOrders, setShowingOrders] = useState<any[]>([]);
  const [activeOrder, setActiveOrder] = useState<any>(null);
  const [sq, setSq] = useState("");

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

    socket.on("takeAwayOrderPreparing", (two: TakeAwayOrder) => {
      setAllTakeAwayOrders((oto) =>
        oto.map((o) => (o.id === two.id ? { ...o, status: "Preparing" } : o))
      );
    });

    socket.on("takeAwayOrderPrepared", (two: TakeAwayOrder) => {
      setAllTakeAwayOrders((oto) =>
        oto.map((o) => (o.id === two.id ? { ...o, status: "Prepared" } : o))
      );
    });

    return () => {
      socket.off("takeAwayOrdersResults");
      socket.off("takeAwayOrdersResultsError");
      socket.off("newTakeAwayOrder");
      socket.off("takeAwayOrderPrepared");
    };
  }, [socket]);

  useEffect(() => {
    let orders;
    switch (tab) {
      case "active-dine-in":
        orders = allDineInOrders.filter((o: any) => ["New", "Prepared"].includes(o.status));
        break;
      case "active-take-away":
        orders = allTakeAwayOrders.filter((o: TakeAwayOrder) =>
          ["New", "Prepared", "Prepared"].includes(o.status)
        );
        break;
      case "past-dine-in":
        orders = allDineInOrders.filter((o: any) => !["New", "Prepared"].includes(o.status));
        break;
      case "past-take-away":
        orders = allTakeAwayOrders.filter(
          (o: TakeAwayOrder) => !["New", "Prepared"].includes(o.status)
        );
        break;
      default:
        orders = [];
    }

    if (sq.trim()) {
      orders = orders.filter((o) => {
        const isTakeAway = tab === "active-take-away" || tab === "past-take-away";
        return o.id.toString().includes(sq.trim().toLowerCase()) || isTakeAway
          ? o.customerName.toLowerCase().includes(sq.trim().toLowerCase()) ||
              o.customerPhone.toLowerCase().includes(sq.trim().toLowerCase())
          : false;
      });
    }

    orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setShowingOrders(orders);
  }, [allTakeAwayOrders, allDineInOrders, tab, sq]);

  return (
    <>
      <Stack direction="row" overflow={"hidden"} flex={1}>
        <Stack
          borderRight={1}
          borderColor={"divider"}
          flex={1}
          bgcolor={"background.paper"}
          overflow={"auto"}
          width={"70%"}
          flexShrink={0}
        >
          <Stack>
            <Tabs
              variant="fullWidth"
              value={tab}
              onChange={(_, v) => setTab(v)}
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                // "& .MuiTabs-indicator": {
                //   display: "none",
                // },
              }}
            >
              <Tab value={"active-dine-in"} label="Active Dine In Orders" />
              <Tab value={"active-take-away"} label="Active Take Away Orders" />
              <Tab value={"past-dine-in"} label="Past Dine In Orders" />
              <Tab value={"past-take-away"} label="Past Take Away Orders" />
            </Tabs>

            <Stack direction={"row"} p={1} gap={2}>
              <TextField
                sx={{
                  flex: 1,
                }}
                value={sq}
                onChange={(e) => setSq(e.target.value)}
                size="small"
                label={`Search orders`}
                variant="filled"
              />
              {/* <Button
                onClick={() => {
                  if (tab === "active-take-away" || tab === "past-take-away")
                    setNewTakeAwayOrderDialogOpen(true);
                }}
                startIcon={<Add />}
                variant="outlined"
              >
                New{" "}
                {tab === "active-take-away" || tab === "past-take-away" ? "Take Away" : "Dine In"}{" "}
                Order
              </Button> */}
            </Stack>
          </Stack>
          <Box
            className="grid grid-cols-1 xl:grid-cols-3 gap-2 h-max max-h-full"
            p={2}
            overflow={"auto"}
          >
            {showingOrders.length ? (
              tab === "active-take-away" || tab === "past-take-away" ? (
                (showingOrders as TakeAwayOrder[]).map((o) => (
                  <TakeAwayOrderItem
                    key={o.id}
                    isActive={activeOrder?.id === o.id}
                    setActive={() => setActiveOrder(o)}
                    order={o}
                  />
                ))
              ) : (
                <></>
              )
            ) : (
              <Typography variant="caption" color="text.secondary">
                No orders.
              </Typography>
            )}
          </Box>
        </Stack>

        <Stack width={"30%"} flexShrink={0} bgcolor={"background.paper"} overflow={"auto"}>
          {activeOrder ? (
            tab === "active-take-away" || tab === "past-take-away" ? (
              <TakeAwayOrderPreview order={activeOrder} close={() => setActiveOrder(null)} />
            ) : (
              <></>
            )
          ) : (
            <Box p={2}>
              <Typography variant="caption" color="text.secondary">
                Select an order to view.
              </Typography>
            </Box>
          )}
        </Stack>
      </Stack>
      {/* <NewTakeAwayOrderDialog
        open={newTakeAwayOrderDialogOpen}
        handleClose={() => setNewTakeAwayOrderDialogOpen(false)}
      /> */}
    </>
  );
};
