import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import type { FC } from "react";

export const NewTakeAwayOrderDialog: FC<{ open: boolean; handleClose: () => void }> = ({
  handleClose,
  open,
}) => {
  return (
    <Dialog open={open} fullScreen>
      <DialogTitle>New Take Away Order</DialogTitle>
      <DialogContent>
        <form onSubmit={() => {}} id="subscription-form">
          <Stack direction={"row"} spacing={2}>
            <TextField
              sx={{ flex: 1 }}
              autoFocus
              required
              margin="dense"
              name="customerName"
              label="Customer Name"
              type="text"
              fullWidth
              variant="filled"
            />
            <TextField
              sx={{ flex: 1 }}
              required
              margin="dense"
              name="customerPhone"
              label="Customer Phone Number"
              type="tel"
              fullWidth
              variant="filled"
            />
          </Stack>
        </form>
      </DialogContent>
      <DialogActions>
        <Button color="inherit" size="large" onClick={handleClose}>
          Cancel
        </Button>
        <Button variant="contained" size="large" type="submit" form="subscription-form">
          Create Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};
