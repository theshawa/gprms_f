import { OrdersService } from "@/services/staff/admin/orders";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { useMemo, useState } from "react";

const getStatusColor = (status: string) => {
  switch (status) {
    case "New":
      return "info";
    case "InProgress":
      return "warning";
    case "Ready":
      return "success";
    case "Completed":
      return "default";
    case "Rejected":
      return "error";
    default:
      return "default";
  }
};

export const Admin_OrdersDineInOrders: FC = () => {
  const [filterType, setFilterType] = useState<"all" | "day" | "month">("all");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const {
    data: orders,
    isLoading,
    error,
  } = useQuery({
    queryKey: [
      "admin",
      "orders",
      "dine-in",
      filterType,
      selectedDate,
      selectedMonth,
      selectedYear,
    ],
    queryFn: () => {
      const filters: any = {};

      if (filterType === "day" && selectedDate) {
        filters.date = selectedDate;
      } else if (filterType === "month" && selectedMonth && selectedYear) {
        filters.month = selectedMonth;
        filters.year = selectedYear;
      }

      return OrdersService.getDineInOrders(filters);
    },
  });

  const totalRevenue = useMemo(() => {
    if (!orders) return 0;
    return orders.reduce((sum, order) => sum + order.totalAmount, 0);
  }, [orders]);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Box>
      {/* Revenue Card */}
      <Card sx={{ mb: 3, bgcolor: "primary.main", color: "white" }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Total Revenue
          </Typography>
          <Typography variant="h3" fontWeight="bold">
            LKR {totalRevenue.toLocaleString()}
          </Typography>
          <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
            {orders?.length || 0} order{(orders?.length || 0) !== 1 ? "s" : ""}
          </Typography>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Filter By</InputLabel>
                <Select
                  value={filterType}
                  label="Filter By"
                  onChange={(e) => {
                    setFilterType(e.target.value as any);
                    setSelectedDate("");
                    setSelectedMonth("");
                    setSelectedYear("");
                  }}
                >
                  <MenuItem value="all">All Orders</MenuItem>
                  <MenuItem value="day">Specific Day</MenuItem>
                  <MenuItem value="month">Specific Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {filterType === "day" && (
              <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                <TextField
                  fullWidth
                  size="small"
                  type="date"
                  label="Select Date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
            )}

            {filterType === "month" && (
              <>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Month</InputLabel>
                    <Select
                      value={selectedMonth}
                      label="Month"
                      onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                      <MenuItem value="1">January</MenuItem>
                      <MenuItem value="2">February</MenuItem>
                      <MenuItem value="3">March</MenuItem>
                      <MenuItem value="4">April</MenuItem>
                      <MenuItem value="5">May</MenuItem>
                      <MenuItem value="6">June</MenuItem>
                      <MenuItem value="7">July</MenuItem>
                      <MenuItem value="8">August</MenuItem>
                      <MenuItem value="9">September</MenuItem>
                      <MenuItem value="10">October</MenuItem>
                      <MenuItem value="11">November</MenuItem>
                      <MenuItem value="12">December</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    fullWidth
                    size="small"
                    type="number"
                    label="Year"
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    placeholder="2025"
                  />
                </Grid>
              </>
            )}

            {filterType !== "all" && (
              <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setFilterType("all");
                    setSelectedDate("");
                    setSelectedMonth("");
                    setSelectedYear("");
                  }}
                >
                  Clear
                </Button>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Order Code
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Customer
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Waiter
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Items
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Total Amount
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Status
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Order Time
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle2" fontWeight="bold">
                  Notes
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={8}>
                  <Alert severity="error">
                    Failed to load dine-in orders. Please try again.
                  </Alert>
                </TableCell>
              </TableRow>
            ) : orders && orders.length > 0 ? (
              orders.map((order) => (
                <TableRow key={order.id} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {order.orderCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {order.customer ? (
                      <Box>
                        <Typography variant="body2">
                          {order.customer.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {order.customer.phoneNumber}
                        </Typography>
                      </Box>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {order.waiter ? (
                      <Typography variant="body2">
                        {order.waiter.username}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="text.secondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {order.orderItems.length} item
                      {order.orderItems.length !== 1 ? "s" : ""}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {order.orderItems
                        .slice(0, 2)
                        .map((item) => item.dish.name)
                        .join(", ")}
                      {order.orderItems.length > 2 && "..."}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      LKR {order.totalAmount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.status}
                      size="small"
                      color={getStatusColor(order.status)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(order.createdAt)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {order.notes || "-"}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No dine-in orders found
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
