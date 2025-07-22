import {
  ShoppingBag,
  Timer,
  CheckCircle,
  LocalShipping,
  Search,
  Refresh,
  Edit,
  Receipt,
  Close,
  Phone,
  Person,
  Schedule,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from "@mui/material";
import type { FC } from "react";
import { useState, useMemo } from "react";

// Mock data for take-away orders
const mockTakeAwayOrders = [
  {
    id: "TAO-001",
    customerName: "Dilshan Rajapaksa",
    customerPhone: "+94 77 123 4567",
    orderTime: "2024-07-21T14:15:00",
    pickupTime: "2024-07-21T15:00:00",
    status: "preparing",
    items: [
      { name: "Grilled Chicken", quantity: 2, price: 2800 },
      { name: "Fried Rice", quantity: 1, price: 1450 },
      { name: "Mixed Vegetables", quantity: 1, price: 980 },
    ],
    total: 8030,
    paymentStatus: "paid",
    paymentMethod: "card",
    specialInstructions: "Extra spicy",
    estimatedTime: 20,
    priority: "normal",
  },
  {
    id: "TAO-002",
    customerName: "Kavitha Silva",
    customerPhone: "+94 71 456 7890",
    orderTime: "2024-07-21T14:30:00",
    pickupTime: "2024-07-21T15:30:00",
    status: "ready",
    items: [
      { name: "Fish Curry", quantity: 1, price: 2100 },
      { name: "Rice", quantity: 2, price: 400 },
      { name: "Papadams", quantity: 1, price: 250 },
    ],
    total: 2750,
    paymentStatus: "pending",
    paymentMethod: "cash",
    specialInstructions: "",
    estimatedTime: 5,
    priority: "normal",
  },
  {
    id: "TAO-003",
    customerName: "Mahesh Fernando",
    customerPhone: "+94 76 987 6543",
    orderTime: "2024-07-21T14:45:00",
    pickupTime: "2024-07-21T16:00:00",
    status: "pending",
    items: [
      { name: "Kottu Rotti", quantity: 1, price: 1950 },
      { name: "Chicken Curry", quantity: 1, price: 2200 },
      { name: "Soft Drink", quantity: 2, price: 380 },
    ],
    total: 4910,
    paymentStatus: "paid",
    paymentMethod: "online",
    specialInstructions: "Less spicy for children",
    estimatedTime: 45,
    priority: "high",
  },
  {
    id: "TAO-004",
    customerName: "Priya Wickremasinghe",
    customerPhone: "+94 75 234 5678",
    orderTime: "2024-07-21T15:00:00",
    pickupTime: "2024-07-21T15:45:00",
    status: "collected",
    items: [
      { name: "Hoppers", quantity: 4, price: 320 },
      { name: "Chicken Curry", quantity: 1, price: 2200 },
      { name: "Coconut Sambol", quantity: 1, price: 150 },
    ],
    total: 3950,
    paymentStatus: "paid",
    paymentMethod: "card",
    specialInstructions: "",
    estimatedTime: 0,
    priority: "normal",
  },
  {
    id: "TAO-005",
    customerName: "Sunil Bandara",
    customerPhone: "+94 77 876 5432",
    orderTime: "2024-07-21T15:15:00",
    pickupTime: "2024-07-21T16:15:00",
    status: "cancelled",
    items: [
      { name: "Biriyani", quantity: 1, price: 3200 },
      { name: "Raita", quantity: 1, price: 450 },
    ],
    total: 3650,
    paymentStatus: "refunded",
    paymentMethod: "card",
    specialInstructions: "Customer cancelled due to delay",
    estimatedTime: 0,
    priority: "normal",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "warning";
    case "preparing": return "info";
    case "ready": return "success";
    case "collected": return "default";
    case "cancelled": return "error";
    default: return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending": return <Timer />;
    case "preparing": return <ShoppingBag />;
    case "ready": return <CheckCircle />;
    case "collected": return <LocalShipping />;
    case "cancelled": return <Close />;
    default: return <Timer />;
  }
};

const getPaymentStatusColor = (status: string) => {
  switch (status) {
    case "paid": return "success";
    case "pending": return "warning";
    case "refunded": return "error";
    default: return "default";
  }
};

const formatPhoneNumber = (phone: string) => {
  // Format Sri Lankan phone numbers
  return phone.replace(/(\+94)(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");
};

export const Admin_OrdersTakeAwayOrders: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return mockTakeAwayOrders.filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerPhone.includes(searchTerm);
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesPayment = paymentFilter === "all" || order.paymentStatus === paymentFilter;

      return matchesSearch && matchesStatus && matchesPayment;
    });
  }, [searchTerm, statusFilter, paymentFilter]);

  const statusCounts = useMemo(() => {
    const counts = { pending: 0, preparing: 0, ready: 0, collected: 0, cancelled: 0 };
    mockTakeAwayOrders.forEach(order => {
      counts[order.status as keyof typeof counts]++;
    });
    return counts;
  }, []);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
  };

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeSinceOrder = (orderTime: string) => {
    const now = new Date();
    const orderDate = new Date(orderTime);
    const diffInMinutes = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60));
    return `${diffInMinutes}m ago`;
  };

  const getTimeUntilPickup = (pickupTime: string) => {
    const now = new Date();
    const pickup = new Date(pickupTime);
    const diffInMinutes = Math.floor((pickup.getTime() - now.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 0) {
      return "Overdue";
    } else if (diffInMinutes === 0) {
      return "Now";
    } else {
      return `${diffInMinutes}m left`;
    }
  };

  return (
    <Box>
      {/* Stats Overview */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {statusCounts.pending}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Pending
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {statusCounts.preparing}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Preparing
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {statusCounts.ready}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ready for Pickup
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="text.secondary" fontWeight="bold">
                {statusCounts.collected}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Collected
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search orders, customer, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="preparing">Preparing</MenuItem>
                  <MenuItem value="ready">Ready</MenuItem>
                  <MenuItem value="collected">Collected</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Payment</InputLabel>
                <Select
                  value={paymentFilter}
                  label="Payment"
                  onChange={(e) => setPaymentFilter(e.target.value)}
                >
                  <MenuItem value="all">All Payments</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="refunded">Refunded</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPaymentFilter("all");
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Payment</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Pickup Time</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="body1" fontWeight="medium">
                      {order.id}
                    </Typography>
                    {order.priority === "high" && (
                      <Chip 
                        label="HIGH" 
                        size="small" 
                        color="error" 
                      />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack>
                    <Typography variant="body1" fontWeight="medium">
                      {order.customerName}
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {formatPhoneNumber(order.customerPhone)}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {order.items.slice(0, 2).map(item => item.name).join(', ')}
                    {order.items.length > 2 && '...'}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body1" fontWeight="medium">
                    LKR {order.total.toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Chip
                      label={order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                      color={getPaymentStatusColor(order.paymentStatus)}
                      size="small"
                    />
                  </Stack>
                  <Typography variant="caption" color="text.secondary" display="block">
                    {order.paymentMethod}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    {getStatusIcon(order.status)}
                    <Chip
                      label={order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      color={getStatusColor(order.status)}
                      size="small"
                    />
                  </Stack>
                  {order.estimatedTime > 0 && (
                    <Typography variant="caption" color="text.secondary" display="block">
                      Est: {order.estimatedTime}m
                    </Typography>
                  )}
                </TableCell>
                <TableCell>
                  <Stack>
                    <Typography variant="body2">
                      {formatTime(order.pickupTime)}
                    </Typography>
                    <Typography 
                      variant="caption" 
                      color={getTimeUntilPickup(order.pickupTime) === "Overdue" ? "error.main" : "text.secondary"}
                    >
                      {getTimeUntilPickup(order.pickupTime)}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleCallCustomer(order.customerPhone)}
                      title="Call Customer"
                    >
                      <Phone />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(order)}
                      title="View Details"
                    >
                      <Receipt />
                    </IconButton>
                    {order.status !== "collected" && order.status !== "cancelled" && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          const nextStatus = order.status === "pending" ? "preparing" :
                                           order.status === "preparing" ? "ready" : "collected";
                          handleUpdateStatus(order.id, nextStatus);
                        }}
                        title="Update Status"
                      >
                        <Edit />
                      </IconButton>
                    )}
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredOrders.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No take-away orders found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Order Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        {selectedOrder && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  Take-Away Order - {selectedOrder.id}
                </Typography>
                <IconButton onClick={() => setDetailsOpen(false)}>
                  <Close />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={3}>
                {/* Customer Info */}
                <Card variant="outlined">
                  <CardContent sx={{ pb: "16px !important" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Customer Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Name
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.customerName}
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Phone
                        </Typography>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body1">
                            {formatPhoneNumber(selectedOrder.customerPhone)}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCallCustomer(selectedOrder.customerPhone)}
                          >
                            <Phone sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Stack>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Order Time
                        </Typography>
                        <Typography variant="body1">
                          {formatTime(selectedOrder.orderTime)}
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Pickup Time
                        </Typography>
                        <Typography variant="body1">
                          {formatTime(selectedOrder.pickupTime)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Order Items */}
                <Card variant="outlined">
                  <CardContent sx={{ pb: "16px !important" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Order Items
                    </Typography>
                    <Stack spacing={2}>
                      {selectedOrder.items.map((item: any, index: number) => (
                        <Stack key={index} direction="row" justifyContent="space-between">
                          <Box>
                            <Typography variant="body1">
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Qty: {item.quantity}
                            </Typography>
                          </Box>
                          <Typography variant="body1" fontWeight="medium">
                            LKR {(item.price * item.quantity).toLocaleString()}
                          </Typography>
                        </Stack>
                      ))}
                      <Divider />
                      <Stack direction="row" justifyContent="space-between">
                        <Typography variant="h6">
                          Total
                        </Typography>
                        <Typography variant="h6" color="primary.main">
                          LKR {selectedOrder.total.toLocaleString()}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>

                {/* Payment Info */}
                <Card variant="outlined">
                  <CardContent sx={{ pb: "16px !important" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Payment Information
                    </Typography>
                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Status
                        </Typography>
                        <Chip
                          label={selectedOrder.paymentStatus.charAt(0).toUpperCase() + selectedOrder.paymentStatus.slice(1)}
                          color={getPaymentStatusColor(selectedOrder.paymentStatus)}
                          size="small"
                        />
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Method
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.paymentMethod.charAt(0).toUpperCase() + selectedOrder.paymentMethod.slice(1)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>

                {/* Special Instructions */}
                {selectedOrder.specialInstructions && (
                  <Card variant="outlined">
                    <CardContent sx={{ pb: "16px !important" }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Special Instructions
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.specialInstructions}
                      </Typography>
                    </CardContent>
                  </Card>
                )}

                {/* Order Status */}
                <Card variant="outlined">
                  <CardContent sx={{ pb: "16px !important" }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Order Status
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2} mb={2}>
                      <Chip
                        icon={getStatusIcon(selectedOrder.status)}
                        label={selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                        color={getStatusColor(selectedOrder.status)}
                      />
                      {selectedOrder.estimatedTime > 0 && (
                        <Typography variant="body2" color="text.secondary">
                          Estimated time: {selectedOrder.estimatedTime} minutes
                        </Typography>
                      )}
                    </Stack>
                    <Typography variant="body2" color="text.secondary">
                      Pickup: {getTimeUntilPickup(selectedOrder.pickupTime)}
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              <Button 
                startIcon={<Phone />}
                onClick={() => handleCallCustomer(selectedOrder.customerPhone)}
              >
                Call Customer
              </Button>
              {selectedOrder.status !== "collected" && selectedOrder.status !== "cancelled" && (
                <Button 
                  variant="contained"
                  onClick={() => {
                    const nextStatus = selectedOrder.status === "pending" ? "preparing" :
                                     selectedOrder.status === "preparing" ? "ready" : "collected";
                    handleUpdateStatus(selectedOrder.id, nextStatus);
                    setDetailsOpen(false);
                  }}
                >
                  Mark as {selectedOrder.status === "pending" ? "Preparing" :
                           selectedOrder.status === "preparing" ? "Ready" : "Collected"}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
