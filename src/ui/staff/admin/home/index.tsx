import { getBackendErrorMessage } from "@/backend";
import { AdminDashboardService } from "@/services/staff/admin/dashboard";
import {
  AttachMoney,
  ShoppingCart,
  TableRestaurant,
  TrendingUp,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { avatarColors } from "../../../../muitheme";

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
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-start"
      >
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
              <TrendingUp
                fontSize="small"
                color={trend > 0 ? "success" : "error"}
              />
              <Typography
                variant="caption"
                color={trend > 0 ? "success.main" : "error.main"}
              >
                {trend > 0 ? "+" : ""}
                {trend}% from yesterday
              </Typography>
            </Stack>
          )}
        </Box>
        <Avatar
          sx={{
            bgcolor:
              color === "primary"
                ? avatarColors.primary.bg
                : color === "success"
                ? avatarColors.success.bg
                : color === "warning"
                ? avatarColors.warning.bg
                : color === "error"
                ? avatarColors.error.bg
                : avatarColors.neutral.bg,
            color:
              color === "primary"
                ? avatarColors.primary.color
                : color === "success"
                ? avatarColors.success.color
                : color === "warning"
                ? avatarColors.warning.color
                : color === "error"
                ? avatarColors.error.color
                : avatarColors.neutral.color,
            border:
              color === "primary"
                ? `1px solid ${avatarColors.primary.border}`
                : color === "success"
                ? `1px solid ${avatarColors.success.border}`
                : color === "warning"
                ? `1px solid ${avatarColors.warning.border}`
                : color === "error"
                ? `1px solid ${avatarColors.error.border}`
                : `1px solid ${avatarColors.neutral.border}`,
          }}
        >
          {icon}
        </Avatar>
      </Stack>
    </CardContent>
  </Card>
);

const getStatusColor = (status: string) => {
  const statusLower = status.toLowerCase();
  switch (statusLower) {
    case "new":
      return "warning";
    case "inprogress":
    case "preparing":
      return "info";
    case "ready":
    case "prepared":
      return "success";
    case "completed":
      return "success";
    case "rejected":
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const formatStatus = (status: string) => {
  // Convert status to readable format
  return status
    .replace(/([A-Z])/g, " $1") // Add space before capital letters
    .trim()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const Admin_HomePage: FC = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch dashboard stats from backend
  const {
    data: dashboardStats,
    isLoading: statsLoading,
    error: statsError,
  } = useQuery({
    queryKey: ["admin-dashboard-stats"],
    queryFn: () => AdminDashboardService.getStats(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch recent orders from backend
  const {
    data: recentOrdersData,
    isLoading: ordersLoading,
    error: ordersError,
  } = useQuery({
    queryKey: ["admin-recent-orders"],
    queryFn: () => AdminDashboardService.getRecentOrders(),
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch dishes from backend
  const {
    data: dishesData,
    isLoading: dishesLoading,
    error: dishesError,
  } = useQuery({
    queryKey: ["admin-dishes"],
    queryFn: () => AdminDashboardService.getDishes(),
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  // Fetch staff members from backend
  const {
    data: staffData,
    isLoading: staffLoading,
    error: staffError,
  } = useQuery({
    queryKey: ["admin-staff"],
    queryFn: () => AdminDashboardService.getStaffMembers(),
    refetchInterval: 60000, // Refetch every 60 seconds
  });

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Box p={3}>
      {/* Header */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Restaurant Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {currentTime.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}{" "}
            • {currentTime.toLocaleTimeString()}
          </Typography>
        </Box>
      </Stack>

      {/* Key Stats */}
      {statsLoading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : statsError ? (
        <Alert severity="error" sx={{ mb: 4 }}>
          Failed to load dashboard statistics:{" "}
          {getBackendErrorMessage(statsError)}
        </Alert>
      ) : dashboardStats ? (
        <Grid container spacing={3} mb={4}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="Today's Orders"
              value={dashboardStats.todayOrders}
              icon={<ShoppingCart />}
              color="primary.main"
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="Today's Revenue"
              value={`LKR ${dashboardStats.todayRevenue.toLocaleString()}`}
              icon={<AttachMoney />}
              color="success.main"
              subtitle={
                dashboardStats.todayOrders > 0
                  ? `Avg: LKR ${Math.round(
                      dashboardStats.todayRevenue / dashboardStats.todayOrders
                    ).toLocaleString()}/order`
                  : undefined
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <StatCard
              title="Total Tables"
              value={dashboardStats.totalTables}
              icon={<TableRestaurant />}
              color="info.main"
              subtitle="Tables in system"
            />
          </Grid>
        </Grid>
      ) : null}

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight="bold">
                  Recent Orders (Today)
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate("/staff/admin/orders")}
                >
                  View All
                </Button>
              </Stack>

              {ordersLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : ordersError ? (
                <Alert severity="error">
                  Failed to load recent orders:{" "}
                  {getBackendErrorMessage(ordersError)}
                </Alert>
              ) : recentOrdersData && recentOrdersData.orders.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Order Code</TableCell>
                        <TableCell>Type</TableCell>
                        <TableCell>Customer/Table</TableCell>
                        <TableCell>Time</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentOrdersData.orders.map((order) => (
                        <TableRow key={`${order.type}-${order.id}`} hover>
                          <TableCell sx={{ fontWeight: "medium" }}>
                            {order.orderCode}
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={
                                order.type === "dine-in"
                                  ? "Dine-In"
                                  : "Take-Away"
                              }
                              size="small"
                              variant="outlined"
                              color={
                                order.type === "dine-in"
                                  ? "primary"
                                  : "secondary"
                              }
                            />
                          </TableCell>
                          <TableCell>
                            {order.type === "dine-in"
                              ? order.tableInfo || "N/A"
                              : order.customerName || "N/A"}
                          </TableCell>
                          <TableCell>{order.time}</TableCell>
                          <TableCell>
                            <Chip
                              label={formatStatus(order.status)}
                              color={getStatusColor(order.status) as any}
                              size="small"
                            />
                          </TableCell>
                          <TableCell align="right">
                            LKR {order.totalAmount.toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Box py={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No orders today yet
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* All Dishes in System */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight="bold">
                  Dishes in System
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate("/staff/admin/dishes")}
                >
                  Manage Menu
                </Button>
              </Stack>

              {dishesLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : dishesError ? (
                <Alert severity="error">
                  Failed to load dishes: {getBackendErrorMessage(dishesError)}
                </Alert>
              ) : dishesData && dishesData.dishes.length > 0 ? (
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                  <Stack spacing={1.5}>
                    {dishesData.dishes.map((dish) => (
                      <Box
                        key={dish.id}
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          bgcolor: "background.default",
                          transition: "background-color 0.2s",
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Box flex={1}>
                            <Typography variant="body1" fontWeight="medium">
                              {dish.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                              sx={{
                                display: "-webkit-box",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                              }}
                            >
                              {dish.description}
                            </Typography>
                          </Box>
                          <Typography
                            variant="body2"
                            fontWeight="bold"
                            color="primary.main"
                          >
                            LKR {dish.price.toLocaleString()}
                          </Typography>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                  <Box mt={2} textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Total: {dishesData.total}{" "}
                      {dishesData.total === 1 ? "dish" : "dishes"}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box py={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No dishes available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Staff */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={2}
              >
                <Typography variant="h6" fontWeight="bold">
                  Staff
                </Typography>
                <Button
                  size="small"
                  onClick={() => navigate("/staff/admin/staff")}
                >
                  Manage Staff
                </Button>
              </Stack>

              {staffLoading ? (
                <Box display="flex" justifyContent="center" py={4}>
                  <CircularProgress />
                </Box>
              ) : staffError ? (
                <Alert severity="error">
                  Failed to load staff: {getBackendErrorMessage(staffError)}
                </Alert>
              ) : staffData && staffData.staffMembers.length > 0 ? (
                <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
                  <Stack spacing={2}>
                    {staffData.staffMembers.map((staff) => (
                      <Box
                        key={staff.id}
                        sx={{
                          p: 2,
                          borderRadius: 1,
                          bgcolor: "background.default",
                          transition: "background-color 0.2s",
                          "&:hover": {
                            bgcolor: "action.hover",
                          },
                        }}
                      >
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            {staff.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </Avatar>
                          <Box flex={1}>
                            <Typography variant="body1" fontWeight="medium">
                              {staff.name}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {staff.role}
                            </Typography>
                          </Box>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                  <Box mt={2} textAlign="center">
                    <Typography variant="caption" color="text.secondary">
                      Total: {staffData.total}{" "}
                      {staffData.total === 1 ? "member" : "members"}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Box py={4} textAlign="center">
                  <Typography variant="body2" color="text.secondary">
                    No staff members available
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};
