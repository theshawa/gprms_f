import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { formatCurrency } from "@/utils/currency-format";
import { formatDateTime } from "@/utils/time-format";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useCallback, useState, type FC } from "react";
import { useSocketConnection } from "../socket-context";
import type { Order } from "@/interfaces/orders";
import { OrdersService } from "@/services/staff/kitchen-manager/orders";

export const OrderCard: FC<{
  order: Order;
  updateParentStatus?: () => void;
}> = ({ order, updateParentStatus }) => {
  const [open, setOpen] = useState(false);
  const [updating, setUpdating] = useState(false);
  const socket = useSocketConnection();

  const { showError } = useAlert();

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  const markAsPrepared = useCallback(async () => {
    setUpdating(true);
    try {
      await OrdersService.markOrderPrepared(order.id);
      updateParentStatus?.();
    } catch (error) {
      showError(
        `Failed to update status to ready: ${getBackendErrorMessage(error)}`
      );
    } finally {
      setUpdating(false);
    }
  }, [socket]);

  const markAsPreparing = useCallback(async () => {
    setUpdating(true);
    try {
      await OrdersService.markOrderPreparing(order.id);
      updateParentStatus?.();
    } catch (error) {
      showError(
        `Failed to update status to in progress: ${getBackendErrorMessage(
          error
        )}`
      );
    } finally {
      setUpdating(false);
    }
  }, [socket]);

  return (
    <>
      <Box component={Paper} p={2} sx={{ boxShadow: 2 }}>
        <Stack
          direction={"row"}
          justifyContent="space-between"
          alignItems="flex-start"
        >
          <Stack flex={1}>
            <Typography variant="subtitle1" noWrap>
              {order.orderCode}
            </Typography>
            <Typography variant="caption">Table: {order.tableId}</Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            flexWrap="wrap"
            gap={1}
            justifyContent="flex-end"
          >
            <Chip label={`Waiter#${order.waiterId}`} />
            <Chip label={formatDateTime(order.createdAt)} />
          </Stack>
        </Stack>

        <List disablePadding sx={{ mt: 2 }}>
          {order.orderItems.map((item, index) => (
            <ListItem sx={{ py: 0.5 }} key={index}>
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography>{item.quantity}x</Typography>
                <Typography sx={{ textTransform: "capitalize" }}>
                  {item.dish?.name}
                </Typography>
              </Box>
            </ListItem>
          ))}
        </List>

        {order.notes && (
          <Stack
            bgcolor={"primary.light"}
            py={1}
            px={2}
            borderRadius={1}
            mt={2}
            color={"primary.dark"}
          >
            <Typography variant="body2">
              <strong>Notes:</strong> {order.notes}
            </Typography>
          </Stack>
        )}

        <Stack direction={"row"} gap={1} mt={2}>
          <Button
            fullWidth
            variant="outlined"
            onClick={openModal}
            sx={{ flex: 1 }}
          >
            Order Details ↗
          </Button>
          {["New", "InProgress"].includes(order.status) && (
            <Button
              fullWidth
              variant="contained"
              disabled={updating}
              onClick={() => {
                if (order.status === "New") markAsPreparing();
                else markAsPrepared();
              }}
              sx={{ flex: 1 }}
            >
              {order.status === "New"
                ? "Mark as Preparing"
                : "Mark as Prepared"}
            </Button>
          )}
        </Stack>
      </Box>

      {/* Modal */}
      <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>Order #{order.id}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1">
            OrderCode: {order.orderCode}
          </Typography>
          <Typography variant="subtitle1">
            {formatCurrency(order.totalAmount)}
          </Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Placed at: {formatDateTime(order.createdAt)}
          </Typography>

          <Box mt={2}>
            <Typography variant="h6">Items</Typography>
            <List>
              {order.orderItems.map((item, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    width="100%"
                  >
                    <Typography>{item.quantity}x</Typography>
                    <Typography sx={{ textTransform: "capitalize" }}>
                      {item.dish?.name}
                    </Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>

          {order.notes && (
            <Typography mt={2} fontStyle="italic">
              <strong>Notes:</strong> {order.notes}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
