import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from "@mui/material";
import type { FC } from "react";

export const AcceptTableDialog: FC<{
  open: boolean;
  handleClose: () => void;
}> = ({ open, handleClose }) => {
  return (
    <Dialog open={open}>
      <DialogContent>
        <DialogContentText>
          Customer at table is waiting for a waiter
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained">Accept</Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
