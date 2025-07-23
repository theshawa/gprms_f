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
import { useSocketConnection } from "../../socket-context";
import { AcceptTableDialog } from "./accept-table-dialog";

export const TableCard: FC<{
  diningTable: DiningTable;
}> = ({ diningTable }) => {
  const [status, setStatus] = useState<string | null>(null);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);

  const socket = useSocketConnection();

  const { showError } = useAlert();

  useEffect(() => {
    if (!socket) return;

    socket.emit("getDiningTableStatus", diningTable.id);

    socket.on("diningTableStatus", (tableId: number, status: string | null) => {
      if (tableId === diningTable.id) {
        setStatus(status);
      }
    });

    socket.on("diningTableStatusError", (err) => {
      showError(`Failed to fetch table status: ${getBackendErrorMessage(err)}`);
    });

    return () => {
      socket.off("diningTableStatus");
      socket.off("diningTableStatusError");
    };
  }, [socket, diningTable]);

  return (
    <>
      <Grid size={1}>
        <Card
          onClick={() => {
            if (status === "waiting-for-waiter") {
              setAcceptDialogOpen(true);
            }
          }}
          sx={{
            backgroundColor:
              status === "waiting-for-waiter"
                ? "orange"
                : status === "order-ongoing"
                ? "lightgreen"
                : "white",
          }}
        >
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {diningTable.name}
            </Typography>
            <Typography
              variant="body2"
              textTransform={"capitalize"}
              color="textSecondary"
            >
              {diningTable.diningArea.name.toLowerCase()}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {diningTable.maxSeats} Seats
            </Typography>
          </CardContent>
          <CardActions>
            <Chip
              label={
                status === "waiting-for-waiter"
                  ? "Customer Waiting"
                  : status === "order-ongoing"
                  ? "Order Ongoing"
                  : "Available"
              }
              size="small"
              color={
                status === "waiting-for-waiter"
                  ? "warning"
                  : status === "order-ongoing"
                  ? "success"
                  : "default"
              }
            />
          </CardActions>
        </Card>
      </Grid>
      {status === "waiting-for-waiter" && (
        <AcceptTableDialog
          open={acceptDialogOpen}
          handleClose={() => setAcceptDialogOpen(false)}
          tableId={diningTable.id}
          updateParentStatus={(s: string) => setStatus(s)}
        />
      )}
    </>
  );
};
