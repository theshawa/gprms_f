import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { WaiterService } from "@/services/staff/waiter";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useEffect, type FC } from "react";
import { useSocketConnection } from "../../socket-context";

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

  useEffect(() => {
    if (!socket) return;

    socket.on("waiter-accepted-table-error", (err) => {
      showError(`Failed to accept table: ${getBackendErrorMessage(err)}`);
    });

    return () => {
      socket.off("waiter-accepted-table-error");
    };
  }, [socket]);

  const { mutate: action } = useMutation({
    mutationFn: () => WaiterService.acceptTable(tableId),
    mutationKey: ["waiterAcceptTable", tableId],
    onSuccess() {
      showSuccess("Table accepted successfully.");
      updateParentStatus("Dining");
      handleClose();
      if (!socket) {
        throw new Error("Socket not connected");
      }
      socket.emit("waiter-accepted-table", {
        tableId,
        waiterId,
      });
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
