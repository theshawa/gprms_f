import {
  TrendingUp,
  Restaurant,
  People,
  TableRestaurant,
  AttachMoney,
  ShoppingCart,
  Assessment,
  Notifications,
  Schedule,
  Star,
  Warning,
  CheckCircle,
  Feedback,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  LinearProgress,
  Stack,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
} from "@mui/material";
import type { FC } from "react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Mock data - replace with real API calls later
const mockDashboardData = {
  todayStats: {
    totalOrders: 142,
    revenue: 12500,
    activeOrders: 18,
    activeTables: 24,
    totalTables: 32,
    avgOrderValue: 88.03,
    tips: 1250,
    customerSatisfaction: 4.7,
  },
  recentOrders: [
    { id: "#12453", table: "A-12", status: "preparing", time: "12:30 PM", total: 125.50 },
    { id: "#12454", table: "B-05", status: "served", time: "12:45 PM", total: 89.25 },
    { id: "#12455", table: "C-08", status: "pending", time: "1:00 PM", total: 156.75 },
    { id: "#12456", table: "A-03", status: "preparing", time: "1:15 PM", total: 92.00 },
  ],
  topDishes: [
    { name: "Grilled Salmon", orders: 23, revenue: 575 },
    { name: "Beef Burger", orders: 31, revenue: 465 },
    { name: "Caesar Salad", orders: 18, revenue: 270 },
    { name: "Pasta Carbonara", orders: 15, revenue: 225 },
  ],
  alerts: [
    { type: "warning", message: "Table 12 has been waiting for 25 minutes", priority: "high" },
    { type: "info", message: "Kitchen reports low stock on salmon", priority: "medium" },
    { type: "success", message: "Daily revenue target achieved", priority: "low" },
  ],
  staffPerformance: [
    { name: "Sarah Johnson", role: "Waiter", tables: 8, rating: 4.9, orders: 24 },
    { name: "Mike Chen", role: "Waiter", tables: 6, rating: 4.7, orders: 18 },
    { name: "Lisa Garcia", role: "Kitchen", rating: 4.8, orders: 42 },
  ],
  hourlyData: [
    { hour: "11:00", orders: 8, revenue: 450 },
    { hour: "12:00", orders: 15, revenue: 825 },
    { hour: "13:00", orders: 22, revenue: 1200 },
    { hour: "14:00", orders: 18, revenue: 950 },
    { hour: "15:00", orders: 12, revenue: 650 },
  ],
};

const StatCard: FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
  trend?: number;
}> = ({ title, value, icon, color, subtitle, trend }) => (
  <Card sx={{ height: "100%" }}>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h4" fontWeight="bold" color={color}>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          {trend !== undefined && (
            <Stack direction="row" alignItems="center" spacing={0.5} mt={0.5}>
              <TrendingUp fontSize="small" color={trend > 0 ? "success" : "error"} />
              <Typography variant="caption" color={trend > 0 ? "success.main" : "error.main"}>
                {trend > 0 ? "+" : ""}{trend}% from yesterday
              </Typography>
            </Stack>
          )}
        </Box>
        <Avatar sx={{ bgcolor: `${color}.10`, color: color }}>
          {icon}
        </Avatar>
      </Stack>
    </CardContent>
  </Card>
);

const getStatusColor = (status: string) => {
  switch (status) {
    case "pending": return "warning";
    case "preparing": return "info";
    case "served": return "success";
    case "cancelled": return "error";
    default: return "default";
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case "warning": return <Warning color="warning" />;
    case "info": return <Notifications color="info" />;
    case "success": return <CheckCircle color="success" />;
    default: return <Notifications />;
  }
};

export const Admin_HomePage: FC = () => {
  const navigate = useNavigate();
  const [data] = useState(mockDashboardData);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const tableOccupancyRate = Math.round((data.todayStats.activeTables / data.todayStats.totalTables) * 100);

  return (
    <Box p={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Restaurant Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentTime.toLocaleDateString("en-US", { 
              weekday: "long", 
              year: "numeric", 
              month: "long", 
              day: "numeric" 
            })} • {currentTime.toLocaleTimeString()}
          </Typography>
        </Box>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" onClick={() => navigate("/staff/admin/analytics")}>
            View Analytics
          </Button>
          <Button variant="contained" onClick={() => navigate("/staff/admin/orders")}>
            Manage Orders
          </Button>
        </Stack>
      </Stack>

      {/* Key Stats */}
      <Grid container spacing={3} mb={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Today's Orders"
            value={data.todayStats.totalOrders}
            icon={<ShoppingCart />}
            color="primary.main"
            trend={12}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Today's Revenue"
            value={`$${data.todayStats.revenue.toLocaleString()}`}
            icon={<AttachMoney />}
            color="success.main"
            subtitle={`Avg: $${data.todayStats.avgOrderValue}/order`}
            trend={8}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Active Tables"
            value={`${data.todayStats.activeTables}/${data.todayStats.totalTables}`}
            icon={<TableRestaurant />}
            color="info.main"
            subtitle={`${tableOccupancyRate}% occupancy`}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <StatCard
            title="Customer Rating"
            value={data.todayStats.customerSatisfaction}
            icon={<Star />}
            color="warning.main"
            subtitle="Based on today's feedback"
            trend={3}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Recent Orders
                </Typography>
                <Button size="small" onClick={() => navigate("/staff/admin/orders")}>
                  View All
                </Button>
              </Stack>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Order ID</TableCell>
                      <TableCell>Table</TableCell>
                      <TableCell>Time</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.recentOrders.map((order) => (
                      <TableRow key={order.id} hover>
                        <TableCell sx={{ fontWeight: "medium" }}>{order.id}</TableCell>
                        <TableCell>{order.table}</TableCell>
                        <TableCell>{order.time}</TableCell>
                        <TableCell>
                          <Chip 
                            label={order.status} 
                            color={getStatusColor(order.status) as any}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">${order.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        {/* Alerts & Notifications */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Alerts & Notifications
              </Typography>
              <Stack spacing={2}>
                {data.alerts.map((alert, index) => (
                  <Box key={index}>
                    <Stack direction="row" spacing={2} alignItems="flex-start">
                      {getAlertIcon(alert.type)}
                      <Box flex={1}>
                        <Typography variant="body2" color="text.primary">
                          {alert.message}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          Priority: {alert.priority}
                        </Typography>
                      </Box>
                    </Stack>
                    {index < data.alerts.length - 1 && <Divider sx={{ mt: 2 }} />}
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Dishes */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Top Dishes Today
                </Typography>
                <Button size="small" onClick={() => navigate("/staff/admin/dishes")}>
                  Manage Menu
                </Button>
              </Stack>
              <Stack spacing={2}>
                {data.topDishes.map((dish, index) => (
                  <Box key={index}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {dish.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {dish.orders} orders
                        </Typography>
                      </Box>
                      <Typography variant="body1" fontWeight="bold">
                        ${dish.revenue}
                      </Typography>
                    </Stack>
                    <LinearProgress 
                      variant="determinate" 
                      value={(dish.orders / 31) * 100} 
                      sx={{ mt: 1 }}
                    />
                  </Box>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Staff Performance */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card>
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6" fontWeight="bold">
                  Staff Performance
                </Typography>
                <Button size="small" onClick={() => navigate("/staff/admin/staff")}>
                  Manage Staff
                </Button>
              </Stack>
              <Stack spacing={2}>
                {data.staffPerformance.map((staff, index) => (
                  <Stack key={index} direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {staff.name.split(" ").map(n => n[0]).join("")}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight="medium">
                          {staff.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {staff.role} • {staff.orders} orders
                        </Typography>
                      </Box>
                    </Stack>
                    <Stack alignItems="flex-end">
                      <Stack direction="row" alignItems="center" spacing={0.5}>
                        <Star fontSize="small" sx={{ color: "warning.main" }} />
                        <Typography variant="body2" fontWeight="medium">
                          {staff.rating}
                        </Typography>
                      </Stack>
                      {staff.tables && (
                        <Typography variant="caption" color="text.secondary">
                          {staff.tables} tables
                        </Typography>
                      )}
                    </Stack>
                  </Stack>
                ))}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Quick Actions */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                Quick Actions
              </Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<People />}
                    onClick={() => navigate("/staff/admin/staff")}
                  >
                    Manage Staff
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<Restaurant />}
                    onClick={() => navigate("/staff/admin/menus")}
                  >
                    Update Menu
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<TableRestaurant />}
                    onClick={() => navigate("/staff/admin/dining-tables")}
                  >
                    Table Layout
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<Assessment />}
                    onClick={() => navigate("/staff/admin/analytics")}
                  >
                    View Analytics
                  </Button>
                </Grid>
              </Grid>
              <Grid container spacing={2} mt={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<Feedback />}
                    onClick={() => navigate("/staff/admin/feedback")}
                  >
                    Customer Feedback
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    startIcon={<Notifications />}
                    onClick={() => navigate("/staff/admin/promotions")}
                  >
                    Promotions & SMS
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    disabled
                    startIcon={<Schedule />}
                  >
                    Kitchen Coordination
                  </Button>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Button 
                    variant="outlined" 
                    fullWidth 
                    disabled
                    startIcon={<Star />}
                  >
                    Loyalty Settings
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
