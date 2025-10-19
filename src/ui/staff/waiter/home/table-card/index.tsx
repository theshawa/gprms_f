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
        console.log("status: ", status);
        setStatus(status);
      }
    });

    socket.on("diningTableStatusError", (err) => {
      showError(`Failed to fetch table status: ${getBackendErrorMessage(err)}`);
    });

    socket.on("customer-waiting", (tableId: number) => {
      if (tableId == diningTable.id) {
        setStatus("WaitingForWaiter");
        // play notification sound
        const audio = new Audio("/sounds/notification.mp3");
        audio.play().catch(() => {
          console.warn("Autoplay blocked until user interacts with the page.");
        });
      }
    });

    socket.on("accepted-table-emit", () => {
      socket.emit("getDiningTableStatus", diningTable.id);
    });

    return () => {
      socket.off("diningTableStatus");
      socket.off("diningTableStatusError");
      socket.off("customer-waiting");
      socket.off("accepted-table-emit");
    };
  }, [socket, diningTable.id]);

  return (
    <>
      <Grid size={1}>
        <Card
          onClick={() => {
            if (status === "WaitingForWaiter") {
              setAcceptDialogOpen(true);
            }
          }}
          sx={{
            backgroundColor:
              status === "WaitingForWaiter"
                ? "orange"
                : status === "Dining"
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
                status === "WaitingForWaiter"
                  ? "Customer Waiting"
                  : status === "Dining"
                  ? "Order Ongoing"
                  : "Available"
              }
              size="small"
              color={
                status === "WaitingForWaiter"
                  ? "warning"
                  : status === "Dining"
                  ? "success"
                  : "default"
              }
            />
          </CardActions>
        </Card>
      </Grid>
      {status === "WaitingForWaiter" && (
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
