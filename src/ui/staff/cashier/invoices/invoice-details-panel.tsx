import type { CashierInvoice, InvoiceOrder } from "@/interfaces/cashier-invoice";
import { formatCurrency } from "@/utils/currency-format";
import {
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Typography,
} from "@mui/material";
import type { FC } from "react";

interface InvoiceDetailsPanelProps {
  invoice: CashierInvoice | null;
  onOrderView: (order: InvoiceOrder) => void;
}

export const InvoiceDetailsPanel: FC<InvoiceDetailsPanelProps> = ({ 
  invoice, 
  onOrderView 
}) => {
  if (!invoice) {
    return (
      <Box 
        display="flex" 
        alignItems="center" 
        justifyContent="center" 
        height="100%" 
        minHeight="400px"
      >
        <Typography variant="body1" color="text.secondary" textAlign="center">
          Click the view button to see Invoice details
        </Typography>
      </Box>
    );
  }

  return (
    <Card sx={{ height: "fit-content" }}>
      <CardContent>
        <Typography variant="h5" component="div" gutterBottom>
          Invoice: {invoice.invoiceNumber}
        </Typography>

        {/* Orders Section */}
        <Box mb={3}>
          {invoice.orders.map((order) => (
            <Box 
              key={order.id}
              display="flex" 
              justifyContent="space-between" 
              alignItems="center"
              py={1}
              sx={{
                borderBottom: "1px solid",
                borderBottomColor: "divider",
                "&:last-child": {
                  borderBottom: "none"
                }
              }}
            >
              <Box flex={1}>
                <Typography variant="body1">
                  {order.name}
                </Typography>
                <Typography variant="body2" color="primary">
                  {formatCurrency(order.unitPrice)}
                </Typography>
              </Box>
              
              <Button 
                variant="contained" 
                size="small"
                sx={{ 
                  bgcolor: "teal",
                  "&:hover": { bgcolor: "darkslategray" },
                  minWidth: "80px",
                  ml: 2
                }}
                onClick={() => onOrderView(order)}
              >
                View
              </Button>
            </Box>
          ))}
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Financial Summary */}
        <Box>
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Subtotal</Typography>
            <Typography variant="body2">{formatCurrency(invoice.subtotal)}</Typography>
          </Box>
          
          {invoice.serviceCharge > 0 && (
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2">Service Charge</Typography>
              <Typography variant="body2">{formatCurrency(invoice.serviceCharge)}</Typography>
            </Box>
          )}
          
          {invoice.discount > 0 && (
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="body2" color="error">Discount</Typography>
              <Typography variant="body2" color="error">-{formatCurrency(invoice.discount)}</Typography>
            </Box>
          )}
          
          <Box display="flex" justifyContent="space-between" mb={1}>
            <Typography variant="body2">Loyalty Points</Typography>
            <Typography variant="body2">{formatCurrency(invoice.loyaltyPoints)}</Typography>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6">Total</Typography>
            <Typography variant="h6">{formatCurrency(invoice.total)}</Typography>
          </Box>
        </Box>

        <Box mt={3}>
          <Button 
            variant="outlined" 
            fullWidth
            sx={{ 
              borderColor: "teal",
              color: "teal",
              "&:hover": { 
                borderColor: "darkslategray",
                color: "darkslategray"
              }
            }}
          >
            Print Bill
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};
