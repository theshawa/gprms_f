import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import type { DiningTable } from "@/interfaces/dining-table";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { type FC, useEffect, useState } from "react";
import { useSocketConnection } from "../socket-context";
import { TableCard } from "./table-card";

export const Waiter_HomePage: FC = () => {
  const [diningTables, setDiningTables] = useState<DiningTable[]>([]);
  const [ongoingOrdersCount, setOngoingOrdersCount] = useState(0);
  const socket = useSocketConnection();
  const { showError } = useAlert();
  const { auth } = useStaffAuth();

  useEffect(() => {
    if (!socket) return;

    socket.emit("getDiningTables", (tables: DiningTable[]) => {
      setDiningTables(tables);
    });

    socket.on("diningTables", (tables: DiningTable[]) => {
      setDiningTables(tables);
    });

    socket.on("diningTablesError", (err) => {
      showError(
        `Failed to fetch assigned tables: ${getBackendErrorMessage(err)}`
      );
    });

    socket.emit("getOngoingOrdersCount", auth!.user.id);

    socket.on("ongoingOrdersCount", (count: number) => {
      setOngoingOrdersCount(count);
    });

    socket.on("ongoingOrdersCountError", (err) => {
      showError(
        `Failed to fetch ongoing orders count: ${getBackendErrorMessage(err)}`
      );
    });

    return () => {
      socket.off("diningTables");
      socket.off("diningTablesError");
      socket.off("ongoingOrdersCount");
      socket.off("ongoingOrdersCountError");
    };
  }, [socket]);

  return (
    <Box p={3}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Typography variant="h5" flex={1}>
          Dining Table Status
        </Typography>
        <Stack direction="row" ml="auto" spacing={1}>
          <Chip
            color="success"
            label={`${diningTables.length} Tables Assigned`}
          />
        </Stack>
      </Stack>
      <Grid
        columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
        container
        spacing={2}
        mt={5}
      >
        {diningTables.map((dt) => (
          <TableCard key={dt.id} diningTable={dt} />
        ))}
        {diningTables.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No tables assigned to you.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};
