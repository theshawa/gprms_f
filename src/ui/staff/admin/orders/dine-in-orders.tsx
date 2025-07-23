import {
  Restaurant,
  Timer,
  CheckCircle,
  Cancel,
  Search,
  FilterList,
  Refresh,
  Edit,
  LocalDining,
  Receipt,
  Close,
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
  LinearProgress,
} from "@mui/material";
import type { FC } from "react";
import { useState, useMemo } from "react";

// Mock data for dine-in orders
const mockDineInOrders = [
  {
    id: "ORD-001",
    table: "A-12",
    customerName: "Saman Perera",
    waiter: "Nuwan Silva",
    orderTime: "2024-07-21T12:30:00",
    status: "preparing",
    items: [
      { name: "Grilled Salmon", quantity: 2, price: 3250 },
      { name: "Caesar Salad", quantity: 1, price: 1950 },
    ],
    total: 8450,
    customerCount: 2,
    specialInstructions: "Extra spicy sauce on the side",
    estimatedTime: 25,
    priority: "normal",
  },
  {
    id: "ORD-002",
    table: "B-05",
    customerName: "Nisha Fernando",
    waiter: "Tharaka Perera",
    orderTime: "2024-07-21T12:45:00",
    status: "served",
    items: [
      { name: "Beef Burger", quantity: 1, price: 2100 },
      { name: "French Fries", quantity: 1, price: 890 },
      { name: "Coca Cola", quantity: 2, price: 380 },
    ],
    total: 3750,
    customerCount: 1,
    specialInstructions: "",
    estimatedTime: 0,
    priority: "normal",
  },
  {
    id: "ORD-003", 
    table: "C-08",
    customerName: "Kasun Rajapaksa",
    waiter: "Sanduni Fernando",
    orderTime: "2024-07-21T13:00:00",
    status: "pending",
    items: [
      { name: "Pasta Carbonara", quantity: 1, price: 2450 },
      { name: "Chocolate Cake", quantity: 2, price: 1680 },
    ],
    total: 5810,
    customerCount: 3,
    specialInstructions: "Birthday celebration - please add candles",
    estimatedTime: 35,
    priority: "high",
  },
  {
    id: "ORD-004",
    table: "A-03",
    customerName: "Amara Wickramasinghe",
    waiter: "Nuwan Silva", 
    orderTime: "2024-07-21T13:15:00",
    status: "preparing",
    items: [
      { name: "Vegetable Curry", quantity: 1, price: 1850 },
      { name: "Rice & Curry", quantity: 1, price: 2200 },
      { name: "Mango Juice", quantity: 1, price: 450 },
    ],
    total: 4500,
    customerCount: 1,
    specialInstructions: "Vegetarian meal",
    estimatedTime: 20,
    priority: "normal",
  },
  {
    id: "ORD-005",
    table: "D-12",
    customerName: "Ruwan Senanayake",
    waiter: "Tharaka Perera",
    orderTime: "2024-07-21T13:30:00", 
    status: "ready",
    items: [
      { name: "Fish & Chips", quantity: 2, price: 2800 },
      { name: "Garden Salad", quantity: 1, price: 1450 },
    ],
    total: 7050,
    customerCount: 2,
    specialInstructions: "",
    estimatedTime: 5,
    priority: "normal",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "warning";
    case "preparing": return "info";
    case "ready": return "success";
    case "served": return "default";
    case "cancelled": return "error";
    default: return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "pending": return <Timer />;
    case "preparing": return <Restaurant />;
    case "ready": return <CheckCircle />;
    case "served": return <LocalDining />;
    case "cancelled": return <Cancel />;
    default: return <Timer />;
  }
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case "high": return "error";
    case "normal": return "default";
    case "low": return "success";
    default: return "default";
  }
};

export const Admin_OrdersDineInOrders: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tableFilter, setTableFilter] = useState("");
  const [waiterFilter, setWaiterFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const filteredOrders = useMemo(() => {
    return mockDineInOrders.filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.table.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || order.status === statusFilter;
      const matchesTable = !tableFilter || order.table.includes(tableFilter);
      const matchesWaiter = !waiterFilter || order.waiter.includes(waiterFilter);

      return matchesSearch && matchesStatus && matchesTable && matchesWaiter;
    });
  }, [searchTerm, statusFilter, tableFilter, waiterFilter]);

  const statusCounts = useMemo(() => {
    const counts = { pending: 0, preparing: 0, ready: 0, served: 0, cancelled: 0 };
    mockDineInOrders.forEach(order => {
      counts[order.status as keyof typeof counts]++;
    });
    return counts;
  }, []);

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    // In real app, this would call an API
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
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
                Ready
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="text.secondary" fontWeight="bold">
                {statusCounts.served}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Served
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
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
                  <MenuItem value="served">Served</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Table..."
                value={tableFilter}
                onChange={(e) => setTableFilter(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Waiter name..."
                value={waiterFilter}
                onChange={(e) => setWaiterFilter(e.target.value)}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Refresh />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTableFilter("");
                  setWaiterFilter("");
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
              <TableCell>Table & Customer</TableCell>
              <TableCell>Waiter</TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Time</TableCell>
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
                        color={getPriorityColor(order.priority)} 
                      />
                    )}
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack>
                    <Typography variant="body1" fontWeight="medium">
                      Table {order.table}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {order.customerName} ({order.customerCount} guests)
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                      {order.waiter.split(' ').map(n => n[0]).join('')}
                    </Avatar>
                    <Typography variant="body2">
                      {order.waiter}
                    </Typography>
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
                  <Typography variant="body2">
                    {formatTime(order.orderTime)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getTimeSinceOrder(order.orderTime)}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(order)}
                      title="View Details"
                    >
                      <Receipt />
                    </IconButton>
                    {order.status !== "served" && order.status !== "cancelled" && (
                      <IconButton
                        size="small"
                        onClick={() => {
                          const nextStatus = order.status === "pending" ? "preparing" :
                                           order.status === "preparing" ? "ready" : "served";
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
                    No dine-in orders found matching your criteria
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
                  Order Details - {selectedOrder.id}
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
                          Table
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.table}
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Guests
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.customerCount}
                        </Typography>
                      </Grid>
                      <Grid size={6}>
                        <Typography variant="body2" color="text.secondary">
                          Waiter
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.waiter}
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
                      Ordered at: {formatTime(selectedOrder.orderTime)} ({getTimeSinceOrder(selectedOrder.orderTime)})
                    </Typography>
                  </CardContent>
                </Card>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              {selectedOrder.status !== "served" && selectedOrder.status !== "cancelled" && (
                <Button 
                  variant="contained"
                  onClick={() => {
                    const nextStatus = selectedOrder.status === "pending" ? "preparing" :
                                     selectedOrder.status === "preparing" ? "ready" : "served";
                    handleUpdateStatus(selectedOrder.id, nextStatus);
                    setDetailsOpen(false);
                  }}
                >
                  Mark as {selectedOrder.status === "pending" ? "Preparing" :
                           selectedOrder.status === "preparing" ? "Ready" : "Served"}
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};
