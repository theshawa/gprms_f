import {
  Avatar,
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
import { useState, type FC } from "react";

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  orderCode: string;
  customerName: string;
  createdAt: string;
  tableNumber: number;
  note?: string;
  items: OrderItem[];
};

interface OrderCardProps {
  order: Order;
}

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
  const [open, setOpen] = useState(false);

  const openModal = () => {
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
  };

  return (
    <>
      <Box component={Paper} p={2} sx={{ boxShadow: 2 }}>
        <Stack direction={"row"}>
          <Stack flex={1} direction={"row"} alignItems={"center"} gap={2}>
            <Avatar
              src="/images/dummy/profile.jpg"
              sx={{ width: 40, height: 40, border: "2px solid #ccc" }}
            />
            <Stack flex={1}>
              <Typography variant="subtitle1">{order.orderCode}</Typography>
              <Typography variant="caption">{order.customerName}</Typography>
            </Stack>
          </Stack>

          <Stack direction={"row"} gap={1}>
            <Chip label={`Table #${order.tableNumber}`} />
            <Chip
              label={new Date(order.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
          </Stack>
        </Stack>

        <List disablePadding sx={{ mt: 2 }}>
          {order.items.map((item, index) => (
            <ListItem sx={{ py: 0.5 }} key={index}>
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography>{item.quantity}x</Typography>
                <Typography>{item.name}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>

        {order.note && (
          <Stack
            bgcolor={"primary.light"}
            py={1}
            px={2}
            borderRadius={1}
            mt={2}
            color={"primary.dark"}
          >
            <Typography variant="body2">
              <strong>Note:</strong> {order.note}
            </Typography>
          </Stack>
        )}

        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 2, background: "teal", mt: 2 }}
          onClick={openModal} // ✅ FIX: don’t call directly, pass function reference
        >
          Order Details ↗
        </Button>
      </Box>

      {/* Modal */}
      <Dialog open={open} onClose={closeModal} fullWidth maxWidth="sm">
        <DialogTitle>Order Details - {order.orderCode}</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1">Customer: {order.customerName}</Typography>
          <Typography variant="subtitle1">Table: #{order.tableNumber}</Typography>
          <Typography variant="subtitle2" color="text.secondary">
            Placed at:{" "}
            {new Date(order.createdAt).toLocaleString([], {
              hour: "2-digit",
              minute: "2-digit",
              day: "numeric",
              month: "short",
            })}
          </Typography>

          <Box mt={2}>
            <Typography variant="h6">Items</Typography>
            <List>
              {order.items.map((item, idx) => (
                <ListItem key={idx} sx={{ py: 0.5 }}>
                  <Box display="flex" justifyContent="space-between" width="100%">
                    <Typography>{item.quantity}x</Typography>
                    <Typography>{item.name}</Typography>
                  </Box>
                </ListItem>
              ))}
            </List>
          </Box>

          {order.note && (
            <Typography mt={2} fontStyle="italic">
              <strong>Note:</strong> {order.note}
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
