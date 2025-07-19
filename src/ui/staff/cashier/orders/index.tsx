import type { CashierInvoice, InvoiceOrder } from "@/interfaces/cashier-invoice";
import {
    Box,
    Button,
    Typography,
} from "@mui/material";
import { type FC, useMemo, useState } from "react";
import { PageLayout } from "../../shared/page-layout";
import { InvoiceCard } from "../invoices/invoice-card";
import { InvoiceDetailsPanel } from "../invoices/invoice-details-panel";
import { OrderDetailsPanel } from "../invoices/order-details-panel";
import { sampleInvoices } from "../invoices/sample-data";
import { OrderFilterBar } from "./filter-bar";

export const Cashier_OrdersPage: FC = () => {
  const [activeTab, setActiveTab] = useState<"dining" | "takeaway">("dining");
  const [selectedInvoice, setSelectedInvoice] = useState<CashierInvoice | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<InvoiceOrder | null>(null);

  // Filter states
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [hourRange, setHourRange] = useState("");

  const clearFilters = () => {
    setMonth("");
    setYear("");
    setDate("");
    setTableNumber("");
    setHourRange("");
  };

  const filteredInvoices = useMemo(() => {
    let filtered = sampleInvoices.filter(invoice => invoice.type === activeTab);

    // Apply filters
    if (month) {
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        return (invoiceDate.getMonth() + 1).toString().padStart(2, '0') === month;
      });
    }

    if (year) {
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        return invoiceDate.getFullYear().toString() === year;
      });
    }

    if (date) {
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        const filterDate = new Date(date);
        return (
          invoiceDate.getFullYear() === filterDate.getFullYear() &&
          invoiceDate.getMonth() === filterDate.getMonth() &&
          invoiceDate.getDate() === filterDate.getDate()
        );
      });
    }

    if (tableNumber) {
      filtered = filtered.filter(invoice => 
        invoice.tableNumber?.toLowerCase().includes(tableNumber.toLowerCase())
      );
    }

    if (hourRange) {
      const [startHour, endHour] = hourRange.split(" - ");
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        const invoiceTime = invoiceDate.toTimeString().substring(0, 5); // HH:MM format
        return invoiceTime >= startHour && invoiceTime < endHour;
      });
    }

    // Sort by creation time (newest first)
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [activeTab, month, year, date, tableNumber, hourRange]);

  const handleInvoiceView = (invoice: CashierInvoice) => {
    setSelectedInvoice(invoice);
    setSelectedOrder(null);
  };

  const handleOrderView = (order: InvoiceOrder) => {
    setSelectedOrder(order);
  };

  const handleTabChange = (newTab: "dining" | "takeaway") => {
    setActiveTab(newTab);
    setSelectedInvoice(null);
    setSelectedOrder(null);
    // Clear table filter when switching to takeaway since takeaway doesn't have tables
    if (newTab === "takeaway") {
      setTableNumber("");
    }
  };

  return (
    <PageLayout 
      title={`${activeTab === "dining" ? "Dining" : "Takeaway"} Orders`}
      subtitle="Filter, sort and manage customer orders"
    >
      {/* Filter Bar */}
      <OrderFilterBar
        month={month}
        setMonth={setMonth}
        year={year}
        setYear={setYear}
        date={date}
        setDate={setDate}
        tableNumber={tableNumber}
        setTableNumber={setTableNumber}
        hourRange={hourRange}
        setHourRange={setHourRange}
        onClearFilters={clearFilters}
      />

      {/* Tab Buttons */}
      <Box mb={3}>
        <Button
          variant={activeTab === "dining" ? "contained" : "outlined"}
          onClick={() => handleTabChange("dining")}
          sx={{ 
            mr: 2,
            ...(activeTab === "dining" && {
              bgcolor: "teal",
              "&:hover": { bgcolor: "darkslategray" }
            })
          }}
        >
          Dining Orders
        </Button>
        <Button
          variant={activeTab === "takeaway" ? "contained" : "outlined"}
          onClick={() => handleTabChange("takeaway")}
          sx={{
            ...(activeTab === "takeaway" && {
              bgcolor: "teal",
              "&:hover": { bgcolor: "darkslategray" }
            })
          }}
        >
          Takeaway Orders
        </Button>
      </Box>

      {/* Results Summary */}
      <Box mb={2}>
        <Typography variant="body2" color="text.secondary">
          Showing {filteredInvoices.length} {activeTab} order(s)
          {(month || year || date || tableNumber || hourRange) && " (filtered)"}
        </Typography>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            lg: "1fr 1fr",
          },
          gap: 3,
        }}
      >
        {/* Left Side - Order Cards */}
        <Box>
          {filteredInvoices.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No {activeTab} orders found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {(month || year || date || tableNumber || hourRange) 
                  ? "Try adjusting your filters or clear all filters"
                  : `There are no orders for the selected category`
                }
              </Typography>
              {(month || year || date || tableNumber || hourRange) && (
                <Button 
                  variant="outlined" 
                  onClick={clearFilters}
                  sx={{ mt: 2 }}
                >
                  Clear All Filters
                </Button>
              )}
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

        {/* Right Side - Order Details */}
        <Box>
          <InvoiceDetailsPanel 
            invoice={selectedInvoice}
            onOrderView={handleOrderView}
          />
          
          {/* Order Details */}
          <OrderDetailsPanel order={selectedOrder} />
        </Box>
      </Box>
    </PageLayout>
  );
};
