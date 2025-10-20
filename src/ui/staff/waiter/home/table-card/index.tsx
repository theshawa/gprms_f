import { useStaffAuth } from "@/hooks/useStaffAuth";
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
  const [status, setStatus] = useState<string | null>(diningTable.tableStatus);
  const [acceptDialogOpen, setAcceptDialogOpen] = useState(false);

  const socket = useSocketConnection();

  const { auth } = useStaffAuth();
  const userId = auth?.user?.id;

  useEffect(() => {
    if (!socket) return;

    socket.on("customer-started-dining", (tableId: number) => {
      if (tableId == diningTable.id) {
        setStatus("WaitingForWaiter");
      }
    });

    socket.on(
      "accepted-table",
      ({ tableId, waiterId }: { tableId: number; waiterId: number }) => {
        if (tableId == diningTable.id && waiterId !== userId) {
          setStatus("Occupied");
        }
      }
    );

    return () => {
      socket.off("customer-started-dining");
    };
  }, [socket, diningTable.id]);

  useEffect(() => {
    if (!status) return;
    if (status === "WaitingForWaiter") {
      const audio = new Audio("/sounds/notification.mp3");
      audio.play().catch(() => {
        console.warn("Autoplay blocked until user interacts with the page.");
      });
    }
  }, [status]);

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
                : status === "Occupied"
                ? "lightgray"
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
                  : status === "Occupied"
                  ? "Served by another waiter"
                  : "Available"
              }
              size="small"
              color={
                status === "WaitingForWaiter"
                  ? "warning"
                  : status === "Dining"
                  ? "success"
                  : status === "Occupied"
                  ? "secondary"
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
