import {
  TrendingUp,
  TrendingDown,
  Restaurant,
  AttachMoney,
  ShoppingCart,
  AccessTime,
  Schedule,
  Star,
  People,
  TableRestaurant,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
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
  LinearProgress,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from "@mui/material";
import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Mock analytics data
const mockAnalyticsData = {
  overview: {
    totalRevenue: 125000,
    totalOrders: 1840,
    avgOrderValue: 67.93,
    customerSatisfaction: 4.6,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
    newCustomers: 245,
    returningCustomers: 68,
  },
  bestSellingItems: [
    { name: "Grilled Salmon", orders: 234, revenue: 5850, trend: 15 },
    { name: "Beef Burger", orders: 189, revenue: 4725, trend: -3 },
    { name: "Caesar Salad", orders: 167, revenue: 2505, trend: 22 },
    { name: "Pasta Carbonara", orders: 145, revenue: 2175, trend: 7 },
    { name: "Chocolate Cake", orders: 112, revenue: 1680, trend: -8 },
  ],
  hourlyData: [
    { hour: "09:00", orders: 12, revenue: 580 },
    { hour: "10:00", orders: 18, revenue: 920 },
    { hour: "11:00", orders: 25, revenue: 1250 },
    { hour: "12:00", orders: 45, revenue: 2850 },
    { hour: "13:00", orders: 52, revenue: 3400 },
    { hour: "14:00", orders: 38, revenue: 2650 },
    { hour: "15:00", orders: 22, revenue: 1580 },
    { hour: "16:00", orders: 15, revenue: 890 },
    { hour: "17:00", orders: 28, revenue: 1680 },
    { hour: "18:00", orders: 42, revenue: 2940 },
    { hour: "19:00", orders: 56, revenue: 4200 },
    { hour: "20:00", orders: 48, revenue: 3680 },
    { hour: "21:00", orders: 35, revenue: 2450 },
  ],
  weeklyRevenue: [
    { day: "Mon", amount: 15400 },
    { day: "Tue", amount: 18200 },
    { day: "Wed", amount: 16800 },
    { day: "Thu", amount: 19500 },
    { day: "Fri", amount: 23400 },
    { day: "Sat", amount: 28900 },
    { day: "Sun", amount: 22800 },
  ],
  tableUtilization: [
    { area: "Main Dining", tables: 20, utilized: 85, revenue: 45000 },
    { area: "Terrace", tables: 12, utilized: 72, revenue: 28000 },
    { area: "Private Rooms", tables: 6, utilized: 95, revenue: 35000 },
    { area: "Bar Area", tables: 8, utilized: 68, revenue: 17000 },
  ],
  staffPerformance: [
    { name: "Sarah Johnson", orders: 156, revenue: 12400, rating: 4.8 },
    { name: "Mike Chen", orders: 142, revenue: 11200, rating: 4.6 },
    { name: "Lisa Garcia", orders: 138, revenue: 10800, rating: 4.7 },
    { name: "David Park", orders: 125, revenue: 9800, rating: 4.5 },
  ],
};

const MetricCard: FC<{
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: number;
  subtitle?: string;
}> = ({ title, value, icon, trend, subtitle }) => (
  <Card>
    <CardContent>
      <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {value}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="caption" color="text.secondary">
              {subtitle}
            </Typography>
          )}
          {trend !== undefined && (
            <Stack direction="row" alignItems="center" spacing={0.5} mt={1}>
              {trend > 0 ? (
                <TrendingUp fontSize="small" color="success" />
              ) : (
                <TrendingDown fontSize="small" color="error" />
              )}
              <Typography
                variant="caption"
                color={trend > 0 ? "success.main" : "error.main"}
              >
                {trend > 0 ? "+" : ""}{trend}% vs last month
              </Typography>
            </Stack>
          )}
        </Box>
        <Avatar sx={{ bgcolor: "primary.light", color: "primary.main" }}>
          {icon}
        </Avatar>
      </Stack>
    </CardContent>
  </Card>
);

export const Admin_AnalyticsPage: FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [timeRange, setTimeRange] = useState("month");
  const data = mockAnalyticsData;

  const maxHourlyOrders = Math.max(...data.hourlyData.map(h => h.orders));
  const maxWeeklyRevenue = Math.max(...data.weeklyRevenue.map(d => d.amount));

  return (
    <Box p={3}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Comprehensive insights into your restaurant performance
          </Typography>
        </Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="week">This Week</MenuItem>
              <MenuItem value="month">This Month</MenuItem>
              <MenuItem value="quarter">This Quarter</MenuItem>
              <MenuItem value="year">This Year</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" onClick={() => navigate("/staff/admin")}>
            Back to Dashboard
          </Button>
        </Stack>
      </Stack>

      {/* Tabs */}
      <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label="Overview" />
        <Tab label="Sales Analysis" />
        <Tab label="Table Utilization" />
        <Tab label="Staff Performance" />
      </Tabs>

      {/* Overview Tab */}
      {activeTab === 0 && (
        <>
          {/* Key Metrics */}
          <Grid container spacing={3} mb={4}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Total Revenue"
                value={`$${data.overview.totalRevenue.toLocaleString()}`}
                icon={<AttachMoney />}
                trend={data.overview.revenueGrowth}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Total Orders"
                value={data.overview.totalOrders}
                icon={<ShoppingCart />}
                trend={data.overview.orderGrowth}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Avg Order Value"
                value={`$${data.overview.avgOrderValue}`}
                icon={<TrendingUp />}
                subtitle="Per transaction"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <MetricCard
                title="Customer Rating"
                value={data.overview.customerSatisfaction}
                icon={<Star />}
                subtitle="Overall satisfaction"
              />
            </Grid>
          </Grid>

          {/* Charts Section */}
          <Grid container spacing={3}>
            {/* Hourly Orders Heatmap */}
            <Grid size={{ xs: 12, lg: 8 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Order Heatmap - Hourly Distribution
                  </Typography>
                  <Box sx={{ mt: 2 }}>
                    <Stack spacing={1}>
                      {data.hourlyData.map((hour) => (
                        <Stack
                          key={hour.hour}
                          direction="row"
                          alignItems="center"
                          spacing={2}
                        >
                          <Typography variant="body2" sx={{ minWidth: 60 }}>
                            {hour.hour}
                          </Typography>
                          <Box sx={{ flex: 1 }}>
                            <LinearProgress
                              variant="determinate"
                              value={(hour.orders / maxHourlyOrders) * 100}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </Box>
                          <Typography variant="body2" sx={{ minWidth: 80 }}>
                            {hour.orders} orders
                          </Typography>
                          <Typography variant="body2" sx={{ minWidth: 80 }}>
                            ${hour.revenue}
                          </Typography>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Best Selling Items */}
            <Grid size={{ xs: 12, lg: 4 }}>
              <Card sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Best Selling Items
                  </Typography>
                  <Stack spacing={2} mt={2}>
                    {data.bestSellingItems.slice(0, 5).map((item, index) => (
                      <Box key={index}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Box>
                            <Typography variant="body1" fontWeight="medium">
                              {item.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.orders} orders • ${item.revenue}
                            </Typography>
                          </Box>
                          <Chip
                            label={`${item.trend > 0 ? "+" : ""}${item.trend}%`}
                            size="small"
                            color={item.trend > 0 ? "success" : "error"}
                          />
                        </Stack>
                        {index < data.bestSellingItems.length - 1 && <Divider sx={{ mt: 2 }} />}
                      </Box>
                    ))}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}

      {/* Sales Analysis Tab */}
      {activeTab === 1 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 8 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Weekly Revenue Trend
                </Typography>
                <Box sx={{ mt: 2 }}>
                  <Stack spacing={2}>
                    {data.weeklyRevenue.map((day) => (
                      <Stack
                        key={day.day}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                      >
                        <Typography variant="body1" sx={{ minWidth: 60 }}>
                          {day.day}
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={(day.amount / maxWeeklyRevenue) * 100}
                            sx={{ height: 12, borderRadius: 6 }}
                          />
                        </Box>
                        <Typography variant="body1" fontWeight="medium" sx={{ minWidth: 100 }}>
                          ${day.amount.toLocaleString()}
                        </Typography>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Customer Analysis
                </Typography>
                <Stack spacing={3} mt={2}>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1">New Customers</Typography>
                      <Typography variant="h5" fontWeight="bold" color="primary.main">
                        {data.overview.newCustomers}
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={75}
                      sx={{ mt: 1 }}
                    />
                  </Box>
                  <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body1">Returning Rate</Typography>
                      <Typography variant="h5" fontWeight="bold" color="success.main">
                        {data.overview.returningCustomers}%
                      </Typography>
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={data.overview.returningCustomers}
                      color="success"
                      sx={{ mt: 1 }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Table Utilization Tab */}
      {activeTab === 2 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Table Utilization by Dining Area
                </Typography>
                <TableContainer sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Dining Area</TableCell>
                        <TableCell align="center">Total Tables</TableCell>
                        <TableCell align="center">Utilization Rate</TableCell>
                        <TableCell align="center">Revenue Generated</TableCell>
                        <TableCell align="center">Performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.tableUtilization.map((area, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar sx={{ bgcolor: "primary.main" }}>
                                <TableRestaurant />
                              </Avatar>
                              <Typography variant="body1" fontWeight="medium">
                                {area.area}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">{area.tables}</TableCell>
                          <TableCell align="center">
                            <Stack alignItems="center" spacing={1}>
                              <Typography variant="body1" fontWeight="medium">
                                {area.utilized}%
                              </Typography>
                              <LinearProgress
                                variant="determinate"
                                value={area.utilized}
                                sx={{ width: 80, height: 6 }}
                                color={area.utilized > 80 ? "success" : area.utilized > 60 ? "warning" : "error"}
                              />
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight="medium">
                              ${area.revenue.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={area.utilized > 80 ? "Excellent" : area.utilized > 60 ? "Good" : "Needs Attention"}
                              color={area.utilized > 80 ? "success" : area.utilized > 60 ? "warning" : "error"}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* Staff Performance Tab */}
      {activeTab === 3 && (
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  Staff Performance Metrics
                </Typography>
                <TableContainer sx={{ mt: 2 }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Staff Member</TableCell>
                        <TableCell align="center">Orders Handled</TableCell>
                        <TableCell align="center">Revenue Generated</TableCell>
                        <TableCell align="center">Customer Rating</TableCell>
                        <TableCell align="center">Performance</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {data.staffPerformance.map((staff, index) => (
                        <TableRow key={index} hover>
                          <TableCell>
                            <Stack direction="row" alignItems="center" spacing={2}>
                              <Avatar sx={{ bgcolor: "primary.main" }}>
                                {staff.name.split(" ").map(n => n[0]).join("")}
                              </Avatar>
                              <Typography variant="body1" fontWeight="medium">
                                {staff.name}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight="medium">
                              {staff.orders}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Typography variant="body1" fontWeight="medium">
                              ${staff.revenue.toLocaleString()}
                            </Typography>
                          </TableCell>
                          <TableCell align="center">
                            <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                              <Star fontSize="small" sx={{ color: "warning.main" }} />
                              <Typography variant="body1" fontWeight="medium">
                                {staff.rating}
                              </Typography>
                            </Stack>
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={staff.rating >= 4.7 ? "Excellent" : staff.rating >= 4.5 ? "Good" : "Average"}
                              color={staff.rating >= 4.7 ? "success" : staff.rating >= 4.5 ? "primary" : "warning"}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}; 