import type { CashierInvoice, InvoiceOrder } from "@/interfaces/cashier-invoice";
import {
    Box,
    Button,
    Grid,
    Typography,
} from "@mui/material";
import { type FC, useState } from "react";
import { PageLayout } from "../../shared/page-layout";
import { InvoiceCard } from "./invoice-card";
import { InvoiceDetailsPanel } from "./invoice-details-panel";
import { OrderDetailsPanel } from "./order-details-panel";
import { sampleInvoices } from "./sample-data";

export const Cashier_InvoicesPage: FC = () => {
  const [activeTab, setActiveTab] = useState<"dining" | "takeaway">("dining");
  const [selectedInvoice, setSelectedInvoice] = useState<CashierInvoice | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<InvoiceOrder | null>(null);

  const filteredInvoices = sampleInvoices.filter(invoice => invoice.type === activeTab);

  const handleInvoiceView = (invoice: CashierInvoice) => {
    setSelectedInvoice(invoice);
    setSelectedOrder(null); // Clear order details when selecting new invoice
  };

  const handleOrderView = (order: InvoiceOrder) => {
    setSelectedOrder(order);
  };

  return (
    <PageLayout 
      title={`${activeTab === "dining" ? "Dining" : "Takeaway"} invoices`}
      subtitle="View and manage customer invoices"
    >
      {/* Tab Buttons */}
      <Box mb={3}>
        <Button
          variant={activeTab === "dining" ? "contained" : "outlined"}
          onClick={() => {
            setActiveTab("dining");
            setSelectedInvoice(null);
            setSelectedOrder(null);
          }}
          sx={{ 
            mr: 2,
            ...(activeTab === "dining" && {
              bgcolor: "teal",
              "&:hover": { bgcolor: "darkslategray" }
            })
          }}
        >
          Dining Invoices
        </Button>
        <Button
          variant={activeTab === "takeaway" ? "contained" : "outlined"}
          onClick={() => {
            setActiveTab("takeaway");
            setSelectedInvoice(null);
            setSelectedOrder(null);
          }}
          sx={{
            ...(activeTab === "takeaway" && {
              bgcolor: "teal",
              "&:hover": { bgcolor: "darkslategray" }
            })
          }}
        >
          Takeaway Invoices
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Side - Invoice Cards */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Box>
            {filteredInvoices.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No {activeTab} invoices found
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  There are no invoices for the selected category
                </Typography>
              </Box>
            ) : (
              <Box>
                {filteredInvoices.map((invoice) => (
                  <InvoiceCard 
                    key={invoice.id}
                    invoice={invoice}
                    onViewClick={handleInvoiceView}
                  />
                ))}
              </Box>
            )}
          </Box>
        </Grid>

        {/* Right Side - Invoice Details */}
        <Grid size={{ xs: 12, md: 6 }}>
          <InvoiceDetailsPanel 
            invoice={selectedInvoice}
            onOrderView={handleOrderView}
          />
          
          {/* Order Details */}
          <OrderDetailsPanel order={selectedOrder} />
        </Grid>
      </Grid>
    </PageLayout>
  );
};
