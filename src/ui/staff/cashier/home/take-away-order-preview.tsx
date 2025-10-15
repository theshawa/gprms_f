import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import type { TakeAwayOrder } from "@/interfaces/take-away-order";
import { CashierTakeAwayOrderService } from "@/services/staff/cashier/take-away";
import { formatCurrency } from "@/utils/currency-format";
import {
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState, type FC } from "react";

export const TakeAwayOrderPreview: FC<{
  order: TakeAwayOrder;
  close: () => void;
  cancelParentOrder: () => void;
  completeParentOrder: () => void;
}> = ({ order, close, cancelParentOrder, completeParentOrder }) => {
  const [processing, setProcessing] = useState(false);

  const { showError } = useAlert();

  const cancelOrder = async () => {
    if (!confirm("Are you sure you want to cancel this take away order?")) return;
    setProcessing(true);
    try {
      await CashierTakeAwayOrderService.cancelTakeAwayOrder(order.id);
      cancelParentOrder();
    } catch (error) {
      showError(`Failed to cancel take-away order: ${getBackendErrorMessage(error)}`);
    } finally {
      setProcessing(false);
    }
  };

  const completeTakeAwayOrder = async () => {
    if (!confirm("Are you sure you want to complete this take away order?")) return;
    setProcessing(true);
    try {
      await CashierTakeAwayOrderService.completeTakeAwayOrder(order.id);
      completeParentOrder();
    } catch (error) {
      showError(`Failed to complete take-away order: ${getBackendErrorMessage(error)}`);
    } finally {
      setProcessing(false);
    }
  };

  const subTotal = order.items.reduce((pv, i) => pv + i.dish.price * i.quantity, 0);

  return (
    <Stack height={"100%"}>
      <Stack
        p={2}
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
        bgcolor={"background.paper"}
        borderBottom={1}
        borderColor={"divider"}
        position="sticky"
        top={0}
      >
        <Typography variant="h6" fontWeight={700}>
          Take Away Order #{order.id}
        </Typography>
        <Chip
          label={
            {
              New: "To be Accepted",
              Preparing: "Ready for Pickup",
              Prepared: "Ready for Pickup",
              Completed: "Completed",
              Cancelled: "Cancelled",
            }[order.status]
          }
          sx={{
            textTransform: "uppercase",
            fontWeight: 500,
          }}
          size="small"
          color={
            order.status === "New"
              ? "info"
              : order.status === "Prepared"
              ? "success"
              : order.status === "Completed"
              ? "default"
              : "warning"
          }
        />
      </Stack>
      <TableContainer sx={{ flex: 1 }}>
        <Table aria-label="items table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item) => (
              <TableRow
                key={item.dish.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{ textTransform: "capitalize" }}>
                  {item.dish.name}
                </TableCell>
                <TableCell align="right">
                  {item.quantity} x {formatCurrency(item.priceAtOrder)} ={" "}
                  {formatCurrency(item.quantity * item.priceAtOrder)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack p={2} gap={2} bgcolor={"background.paper"} position="sticky" bottom={0}>
        <Typography variant="h6">Total Amount: {formatCurrency(subTotal)}</Typography>
        <Stack direction="row" gap={1}>
          <Button
            onClick={close}
            color="inherit"
            variant="contained"
            disabled={processing}
            sx={{
              flex: 1,
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!["New", "Prepared"].includes(order.status) || processing}
            sx={{
              flex: 1,
            }}
            onClick={cancelOrder}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!["Prepared"].includes(order.status) || processing}
            sx={{
              flex: 1,
            }}
            onClick={completeTakeAwayOrder}
          >
            Complete
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
