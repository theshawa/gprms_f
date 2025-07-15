import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import type { DiningTable } from "@/interfaces/dining-table";
import {
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { type FC, useEffect, useState } from "react";
import { useSocketConnection } from "../socket-context";

export const TableCard: FC<{
  diningTable: DiningTable;
}> = ({ diningTable }) => {
  const [ongoing, setOngoing] = useState(false);
  const [customerIsWaiting, setCustomerIsWaiting] = useState(false);
  const socket = useSocketConnection();

  const { showError } = useAlert();

  useEffect(() => {
    if (!socket) return;

    socket.emit("getDiningTableStatus", diningTable.id);

    socket.on("diningTableStatus", (tableId: number, status: boolean) => {
      // if (tableId === diningTable.id) {
      //   setOngoing(status);
      // }
    });

    socket.on("diningTableStatusError", (err) => {
      showError(`Failed to fetch table status: ${getBackendErrorMessage(err)}`);
    });

    socket.on("customerWaitingAtDiningTable", (data) => {
      console.log(data.tableId, diningTable.id);

      if (data.tableId === diningTable.id) {
        console.log("Customer waiting at dining table:", data);

        setCustomerIsWaiting(true);
      }
    });

    return () => {
      socket.off("diningTableStatus");
      socket.off("diningTableStatusError");
      socket.off("customerWaitingAtDiningTable");
    };
  }, [socket, diningTable]);

  return (
    <Grid size={1}>
      <Card
        sx={{
          backgroundColor: customerIsWaiting
            ? "orange"
            : ongoing
            ? "lightgreen"
            : "white",
        }}
      >
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {diningTable.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Area {diningTable.diningArea.name}
            <br />
            {diningTable.maxSeats} Seats
          </Typography>
        </CardContent>
        <CardActions>
          <Chip
            label={
              customerIsWaiting
                ? "Customer Waiting"
                : ongoing
                ? "Order Ongoing"
                : "Available"
            }
            size="small"
            color={
              customerIsWaiting ? "warning" : ongoing ? "success" : "default"
            }
          />
        </CardActions>
      </Card>
    </Grid>
  );
};
