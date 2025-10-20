import { Alert, AlertTitle, Typography, Paper, Box, Chip, Button, Stack } from "@mui/material";
import { type FC, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CustomerOrderService, CustomerWaiterService } from "@/services/customer";
import type { Order } from "@/interfaces/orders";
import type { WaiterInfo } from "@/services/customer/waiter";
import { Customer_DineInContext } from "../context";
import { WaiterAssistanceDialog } from "../waiter-assistance";

export const Customer_DineInStatusPage: FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
  const [assignedWaiter, setAssignedWaiter] = useState<WaiterInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showWaiterDialog, setShowWaiterDialog] = useState(false);

  const data = useContext(Customer_DineInContext);

  useEffect(() => {
    const fetchOrderStatus = async () => {
      if (!tableId) return;

      try {
        setLoading(true);
        const [orderData, waiterData] = await Promise.all([
          CustomerOrderService.getCurrentTableOrder(Number(tableId)).catch(() => null),
          CustomerWaiterService.getAssignedWaiter(Number(tableId)).catch(() => null)
        ]);

        setCurrentOrder(orderData);
        setAssignedWaiter(waiterData);
      } catch (err: any) {
        setError(err?.response?.data?.message || "Failed to fetch order status");
      } finally {
        setLoading(false);
      }
    };

    fetchOrderStatus();
  }, [tableId]);

  const handleRequestWaiter = async () => {
    setShowWaiterDialog(true);
  };

  if (loading) {
    return (
      <Typography variant="h6">Loading order status...</Typography>
    );
  }

  return (
    <>
      <Typography variant="h4" gutterBottom mb={3}>
        Dine-In Status
      </Typography>

      {data && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Box display="flex" gap={1} mb={2}>
            <Chip label={`Table: ${data.diningTable.name}`} color="primary" />
            <Chip label={`Meal: ${data.menu.meal}`} color="secondary" />
          </Box>
        </Paper>
      )}

      {assignedWaiter && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Your Waiter
          </Typography>
          <Typography variant="body1">
            <strong>{assignedWaiter.name}</strong> is assigned to your table
          </Typography>
          <Chip label={assignedWaiter.status} size="small" sx={{ mt: 1 }} />
        </Paper>
      )}

      {currentOrder ? (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Current Order Status
          </Typography>
          <Alert severity="info" sx={{ mb: 2 }}>
            <AlertTitle>Order #{currentOrder.orderCode}</AlertTitle>
            Your order is being prepared. Status: {currentOrder.status}
          </Alert>
          
          <Typography variant="subtitle2" gutterBottom>
            Order Status: <Chip label={currentOrder.status} size="small" />
          </Typography>
          
          {currentOrder.orderItems && currentOrder.orderItems.length > 0 && (
            <Box mt={2}>
              <Typography variant="subtitle2" gutterBottom>
                Ordered Items:
              </Typography>
              {currentOrder.orderItems.map((item: any, index: number) => (
                <Typography key={index} variant="body2">
                  • {item.quantity}x {item.dish?.name || 'Item'}
                </Typography>
              ))}
            </Box>
          )}
        </Paper>
      ) : (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <AlertTitle>No Active Order</AlertTitle>
          You don't have any active orders. You can start ordering from the menu.
        </Alert>
      )}

      <Stack direction="row" spacing={2}>
        <Button
          variant="outlined"
          onClick={handleRequestWaiter}
          fullWidth
        >
          Call Waiter
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={() => window.location.href = `/dine-in/${tableId}/menu`}
        >
          Order More Items
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <WaiterAssistanceDialog
        open={showWaiterDialog}
        onClose={() => setShowWaiterDialog(false)}
        tableId={Number(tableId)}
      />
    </>
  );
};
