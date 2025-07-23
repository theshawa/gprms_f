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

export const AcceptTableDialog: FC<{
  open: boolean;
  handleClose: () => void;
  tableId: number;
  updateParentStatus: (s: string) => void;
}> = ({ open, handleClose, tableId, updateParentStatus }) => {
  const { showError, showSuccess } = useAlert();

  const { mutate: action } = useMutation({
    mutationFn: () => WaiterService.acceptTable(tableId),
    mutationKey: ["waiterAcceptTable", tableId],
    onSuccess() {
      showSuccess("Table accepted successfully.");
      updateParentStatus("order-ongoing");
      handleClose();
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
