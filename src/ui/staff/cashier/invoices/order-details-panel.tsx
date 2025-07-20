import type { InvoiceOrder } from "@/interfaces/cashier-invoice";
import { formatCurrency } from "@/utils/currency-format";
import {
    Box,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import type { FC } from "react";

interface OrderDetailsPanelProps {
  order: InvoiceOrder | null;
}

export const OrderDetailsPanel: FC<OrderDetailsPanelProps> = ({ order }) => {
  if (!order) {
    return null;
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" gutterBottom>
          Order Details
        </Typography>

        <Box mb={2}>
          <Typography variant="body1" gutterBottom>
            <strong>Item:</strong> {order.name}
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            <strong>Quantity:</strong> {order.quantity}
          </Typography>
          
          <Typography variant="body2" gutterBottom>
            <strong>Unit Price:</strong> {formatCurrency(order.unitPrice)}
          </Typography>
          
          <Typography variant="body1" sx={{ mt: 1 }}>
            <strong>Total Price:</strong> {formatCurrency(order.totalPrice)}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
