import type { CashierInvoice, InvoiceOrder } from "@/interfaces/cashier-invoice";
import {
    Box,
    Button,
    Grid,
    Typography,
    TextField,
    InputAdornment,
    Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import PersonIcon from "@mui/icons-material/Person";
import TableRestaurantIcon from "@mui/icons-material/TableRestaurant";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { type FC, useState, useMemo } from "react";
import { PageLayout } from "../../shared/page-layout";
import { InvoiceCard } from "./invoice-card";
import { InvoiceDetailsPanel } from "./invoice-details-panel";
import { OrderDetailsPanel } from "./order-details-panel";
import { useInvoices } from "../shared/invoice-context";

export const Cashier_InvoicesPage: FC = () => {
  const [activeTab, setActiveTab] = useState<"dining" | "takeaway">("dining");
  const [selectedInvoice, setSelectedInvoice] = useState<CashierInvoice | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<InvoiceOrder | null>(null);
  const [searchFilters, setSearchFilters] = useState({
    customerName: "",
    tableName: "",
    date: "",
    invoiceNumber: ""
  });
  const { invoices } = useInvoices();

  // Filter and search invoices
  const filteredInvoices = useMemo(() => {
    let filtered = invoices.filter(invoice => invoice.type === activeTab);
    
    // Apply individual filters
    if (searchFilters.customerName.trim()) {
      const customerQuery = searchFilters.customerName.toLowerCase().trim();
      filtered = filtered.filter(invoice => 
        invoice.customerName?.toLowerCase().includes(customerQuery)
      );
    }
    
    if (searchFilters.tableName.trim() && activeTab === "dining") {
      const tableQuery = searchFilters.tableName.toLowerCase().trim();
      filtered = filtered.filter(invoice => 
        invoice.tableNumber?.toLowerCase().includes(tableQuery)
      );
    }
    
    if (searchFilters.date.trim()) {
      const dateQuery = searchFilters.date.toLowerCase().trim();
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt);
        const dateString = invoiceDate.toLocaleDateString().toLowerCase();
        return dateString.includes(dateQuery);
      });
    }
    
    if (searchFilters.invoiceNumber.trim()) {
      const invoiceQuery = searchFilters.invoiceNumber.toLowerCase().trim();
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber.toLowerCase().includes(invoiceQuery)
      );
    }
    
    return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [invoices, activeTab, searchFilters]);

  const handleInvoiceView = (invoice: CashierInvoice) => {
    setSelectedInvoice(invoice);
    setSelectedOrder(null); // Clear order details when selecting new invoice
  };

  const handleOrderView = (order: InvoiceOrder) => {
    setSelectedOrder(order);
  };

  const updateSearchFilter = (field: keyof typeof searchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const clearAllFilters = () => {
    setSearchFilters({
      customerName: "",
      tableName: "",
      date: "",
      invoiceNumber: ""
    });
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
            clearAllFilters(); // Clear all filters when switching tabs
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
            clearAllFilters(); // Clear all filters when switching tabs
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

      {/* Individual Search Fields */}
      <Box mb={3}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          {/* Customer Name Search */}
          <TextField
            placeholder="Search by customer name"
            value={searchFilters.customerName}
            onChange={(e) => updateSearchFilter("customerName", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.paper",
              },
            }}
          />

          {/* Table Name Search - Only for dining */}
          {activeTab === "dining" && (
            <TextField
              placeholder="Search by table name"
              value={searchFilters.tableName}
              onChange={(e) => updateSearchFilter("tableName", e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <TableRestaurantIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{
                flex: 1,
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                  bgcolor: "background.paper",
                },
              }}
            />
          )}

          {/* Date Search */}
          <TextField
            placeholder="Search by date"
            value={searchFilters.date}
            onChange={(e) => updateSearchFilter("date", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <CalendarTodayIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.paper",
              },
            }}
          />

          {/* Invoice Number Search */}
          <TextField
            placeholder="Search by invoice #"
            value={searchFilters.invoiceNumber}
            onChange={(e) => updateSearchFilter("invoiceNumber", e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <ReceiptIcon color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              flex: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
                bgcolor: "background.paper",
              },
            }}
          />
        </Stack>

        {/* Clear Filters Button */}
        {(searchFilters.customerName || searchFilters.tableName || searchFilters.date || searchFilters.invoiceNumber) && (
          <Box mt={2}>
            <Button 
              variant="outlined" 
              size="small" 
              onClick={clearAllFilters}
              sx={{ borderRadius: 2 }}
            >
              Clear All Filters
            </Button>
          </Box>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Left Side - Invoice Cards */}
        <Grid size={{ xs: 12, md: 6 }}>
          {/* Results Counter */}
          {(filteredInvoices.length > 0 || Object.values(searchFilters).some(filter => filter.trim())) && (
            <Box mb={2}>
              <Typography variant="body2" color="text.secondary">
                {Object.values(searchFilters).some(filter => filter.trim())
                  ? `${filteredInvoices.length} result${filteredInvoices.length !== 1 ? 's' : ''} found with applied filters`
                  : `${filteredInvoices.length} ${activeTab} invoice${filteredInvoices.length !== 1 ? 's' : ''}`
                }
              </Typography>
            </Box>
          )}
          
          <Box>
            {filteredInvoices.length === 0 ? (
              <Box textAlign="center" py={4}>
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  {Object.values(searchFilters).some(filter => filter.trim()) 
                    ? "No results found with current filters" 
                    : `No ${activeTab} invoices found`
                  }
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {Object.values(searchFilters).some(filter => filter.trim())
                    ? "Try adjusting your search filters or clear all filters to see all invoices"
                    : "There are no invoices for the selected category"
                  }
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
