import { useConfirmation } from "@/hooks/useConfirmation";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import type { FC } from "react";

export const ConfirmationComponent: FC = () => {
  const { _confirmation } = useConfirmation();

  return (
    <Dialog
      open={_confirmation.open}
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          _confirmation?.onConfirm(false);
        }
      }}
    >
      <DialogTitle>{_confirmation?.title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{_confirmation?.message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            _confirmation?.onConfirm(false);
          }}
        >
          {_confirmation?.cancelText || "Cancel"}
        </Button>
        <Button
          onClick={() => {
            _confirmation?.onConfirm(true);
          }}
          variant="contained"
          color={_confirmation?.confirmButtonDanger ? "error" : "primary"}
        >
          {_confirmation?.confirmText || "Yes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
