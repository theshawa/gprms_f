import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { WaiterService } from "@/services/staff/waiter";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import type { FC } from "react";
import { useSocketConnection } from "../../socket-context";
import { useStaffAuth } from "@/hooks/useStaffAuth";

export const AcceptTableDialog: FC<{
  open: boolean;
  handleClose: () => void;
  tableId: number;
  updateParentStatus: (s: string) => void;
}> = ({ open, handleClose, tableId, updateParentStatus }) => {
  const { showError, showSuccess } = useAlert();
  const socket = useSocketConnection();
  const { auth } = useStaffAuth();
  const waiterId = auth?.user?.id;

  const { mutate: action } = useMutation({
    mutationFn: () => WaiterService.acceptTable(tableId),
    mutationKey: ["waiterAcceptTable", tableId],
    onSuccess() {
      showSuccess("Table accepted successfully.");
      updateParentStatus("order-ongoing");
      handleClose();
      if (socket) {
        socket.emit("waiterAcceptedTable", {
          tableId,
          waiterId,
          message: `Waiter accepted table ${tableId}`,
          timestamp: new Date().toISOString(),
          source: "waiter",
        });
        console.log("Socket emitted waiterAcceptedTable for table:", tableId);
      } else {
        console.warn("Socket not connected, cannot emit waiterAcceptedTable");
      }
    },
    onError(err) {
      showError(`Failed to accept table: ${getBackendErrorMessage(err)}`);
    },
  });

  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogContentText>
          Customer at table is waiting for a waiter
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={() => action()}>
          Accept
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
