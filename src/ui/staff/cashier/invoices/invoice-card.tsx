import type { CashierInvoice } from "@/interfaces/cashier-invoice";
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
} from "@mui/material";
import type { FC } from "react";

interface InvoiceCardProps {
  invoice: CashierInvoice;
  onViewClick: (invoice: CashierInvoice) => void;
}

export const InvoiceCard: FC<InvoiceCardProps> = ({ invoice, onViewClick }) => {
  const formatOrderItems = (orders: any[]) => {
    return orders.map(order => `${order.name} × ${order.quantity}`).join(", ");
  };

  return (
    <Card 
      sx={{ 
        mb: 2,
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        }
      }}
    >
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Box>
            <Typography variant="h6" component="div" gutterBottom>
              Invoice: {invoice.invoiceNumber}
              {invoice.tableNumber && (
                <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 1 }}>
                  | Table: {invoice.tableNumber}
                </Typography>
              )}
            </Typography>
            
            <Typography variant="body2" color="primary" sx={{ mb: 1 }}>
              {formatOrderItems(invoice.orders)}
            </Typography>
          </Box>

          <Button 
            variant="contained" 
            size="small"
            sx={{ 
              bgcolor: "teal",
              "&:hover": { bgcolor: "darkslategray" },
              minWidth: "80px"
            }}
            onClick={() => onViewClick(invoice)}
          >
            View
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
