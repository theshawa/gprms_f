import {
  Cake,
  CardGiftcard,
  Close,
  Delete,
  Edit,
  Email,
  History,
  LocalOffer,
  MoreVert,
  Phone,
  Visibility,
} from "@mui/icons-material";
import {
  Avatar,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Rating,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import { useMemo, useState } from "react";
import { PageLayout } from "../../shared/page-layout";
import { avatarColors } from "../../../../muitheme";

// Mock data for customers
const mockCustomers = [
  {
    id: "CUST-001",
    name: "Priya Wickramasinghe",
    email: "priya.wickramasinghe@email.com",
    phone: "+94 77 123 4567",
    birthday: "1988-03-15",
    joinedDate: "2023-01-15",
    status: "active",
    tier: "gold",
    totalOrders: 45,
    totalSpent: 487500,
    averageOrderValue: 10833,
    lastOrderDate: "2024-07-20",
    loyaltyPoints: 2437,
    preferences: ["vegetarian", "no_spicy"],
    notes: "Prefers window tables, regular customer",
    visits: 52,
    rating: 4.8,
  },
  {
    id: "CUST-002",
    name: "Kasun Rajapaksa",
    email: "kasun.rajapaksa@email.com",
    phone: "+94 71 456 7890",
    birthday: "1992-08-22",
    joinedDate: "2023-03-20",
    status: "active",
    tier: "silver",
    totalOrders: 28,
    totalSpent: 325600,
    averageOrderValue: 11628,
    lastOrderDate: "2024-07-18",
    loyaltyPoints: 4250,
    preferences: ["spicy", "traditional"],
    notes: "Business meetings, prefers quick service",
    visits: 32,
    rating: 4.6,
  },
  {
    id: "CUST-003",
    name: "Sanduni Fernando",
    email: "sanduni.fernando@email.com",
    phone: "+94 76 789 0123",
    birthday: "1995-12-05",
    joinedDate: "2024-01-10",
    status: "active",
    tier: "bronze",
    totalOrders: 12,
    totalSpent: 145800,
    averageOrderValue: 12150,
    lastOrderDate: "2024-07-21",
    loyaltyPoints: 3125,
    preferences: ["italian", "desserts"],
    notes: "Young professional, weekend diner",
    visits: 15,
    rating: 4.9,
  },
  {
    id: "CUST-004",
    name: "Mahesh Bandara",
    email: "mahesh.bandara@email.com",
    phone: "+94 75 234 5678",
    birthday: "1985-06-18",
    joinedDate: "2022-09-12",
    status: "vip",
    tier: "platinum",
    totalOrders: 87,
    totalSpent: 1250000,
    averageOrderValue: 14367,
    lastOrderDate: "2024-07-19",
    loyaltyPoints: 6250,
    preferences: ["seafood", "premium", "wine_pairing"],
    notes: "VIP customer, special occasions, celebrates anniversaries here",
    visits: 94,
    rating: 4.9,
  },
  {
    id: "CUST-005",
    name: "Nayomi Silva",
    email: "nayomi.silva@email.com",
    phone: "+94 77 345 6789",
    birthday: "1990-11-30",
    joinedDate: "2023-05-08",
    status: "inactive",
    tier: "bronze",
    totalOrders: 8,
    totalSpent: 67200,
    averageOrderValue: 8400,
    lastOrderDate: "2024-03-15",
    loyaltyPoints: 1250,
    preferences: ["vegetarian", "healthy"],
    notes: "Health-conscious, family dining",
    visits: 10,
    rating: 4.3,
  },
  {
    id: "CUST-006",
    name: "Roshan Jayawardena",
    email: "roshan.j@email.com",
    phone: "+94 71 987 6543",
    birthday: "1987-04-25",
    joinedDate: "2023-11-22",
    status: "active",
    tier: "silver",
    totalOrders: 23,
    totalSpent: 298500,
    averageOrderValue: 12978,
    lastOrderDate: "2024-07-17",
    loyaltyPoints: 1492,
    preferences: ["meat", "beverages"],
    notes: "Sports events watcher, prefers bar area",
    visits: 28,
    rating: 4.7,
  },
];

const getTierColor = (tier: string) => {
  switch (tier) {
    case "platinum":
      return "error";
    case "gold":
      return "warning";
    case "silver":
      return "info";
    case "bronze":
      return "default";
    default:
      return "default";
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active":
      return "success";
    case "vip":
      return "error";
    case "inactive":
      return "default";
    default:
      return "default";
  }
};

const formatCurrency = (amount: number) => {
  return `LKR ${amount.toLocaleString()}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getCustomerAge = (birthday: string) => {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const Admin_CustomerPage: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [tierFilter, setTierFilter] = useState("all");
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>("");
  const [activeTab, setActiveTab] = useState(0);

  const filteredCustomers = useMemo(() => {
    return mockCustomers.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.id.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || customer.status === statusFilter;
      const matchesTier = tierFilter === "all" || customer.tier === tierFilter;

      return matchesSearch && matchesStatus && matchesTier;
    });
  }, [searchTerm, statusFilter, tierFilter]);

  const customerStats = useMemo(() => {
    const stats = {
      total: mockCustomers.length,
      active: mockCustomers.filter((c) => c.status === "active").length,
      vip: mockCustomers.filter((c) => c.status === "vip").length,
      inactive: mockCustomers.filter((c) => c.status === "inactive").length,
      totalRevenue: mockCustomers.reduce((sum, c) => sum + c.totalSpent, 0),
      avgOrderValue: Math.round(
        mockCustomers.reduce((sum, c) => sum + c.averageOrderValue, 0) /
          mockCustomers.length
      ),
    };
    return stats;
  }, []);

  const tierCounts = useMemo(() => {
    const counts = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
    mockCustomers.forEach((customer) => {
      counts[customer.tier as keyof typeof counts]++;
    });
    return counts;
  }, []);

  const handleViewDetails = (customer: any) => {
    setSelectedCustomer(customer);
    setDetailsOpen(true);
  };

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    customerId: string
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedCustomerId(customerId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCustomerId("");
  };

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const handleEmailCustomer = (email: string) => {
    window.open(`mailto:${email}`);
  };

  return (
    <PageLayout
      title="Customer Management"
      subtitle="Manage customer profiles, loyalty programs, and relationships"
    >
      {/* Stats Overview */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {customerStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {customerStats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Customers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {formatCurrency(customerStats.totalRevenue).replace("LKR ", "")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Revenue
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {formatCurrency(customerStats.avgOrderValue).replace(
                  "LKR ",
                  ""
                )}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Order Value
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tier Distribution */}
      {/* <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Customer Tier Distribution
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack alignItems="center">
                <Typography variant="h5" color="error.main" fontWeight="bold">
                  {tierCounts.platinum}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Platinum
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack alignItems="center">
                <Typography variant="h5" color="warning.main" fontWeight="bold">
                  {tierCounts.gold}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Gold
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack alignItems="center">
                <Typography variant="h5" color="info.main" fontWeight="bold">
                  {tierCounts.silver}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Silver
                </Typography>
              </Stack>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Stack alignItems="center">
                <Typography
                  variant="h5"
                  color="text.secondary"
                  fontWeight="bold"
                >
                  {tierCounts.bronze}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Bronze
                </Typography>
              </Stack>
            </Grid>
          </Grid>
        </CardContent>
      </Card> */}

      {/* Filters */}
      {/* <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <Search sx={{ mr: 1, color: "text.secondary" }} />
                  ),
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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="vip">VIP</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Tier</InputLabel>
                <Select
                  value={tierFilter}
                  label="Tier"
                  onChange={(e) => setTierFilter(e.target.value)}
                >
                  <MenuItem value="all">All Tiers</MenuItem>
                  <MenuItem value="platinum">Platinum</MenuItem>
                  <MenuItem value="gold">Gold</MenuItem>
                  <MenuItem value="silver">Silver</MenuItem>
                  <MenuItem value="bronze">Bronze</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setTierFilter("all");
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card> */}

      {/* Customers Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Customer</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Tier & Status</TableCell>
              <TableCell>Orders & Spending</TableCell>
              <TableCell>Loyalty Points</TableCell>
              <TableCell>Last Order</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id} hover>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={2}>

                    <Avatar sx={{ bgcolor: "primary.main" }}>
                      {customer.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </Avatar>
                    <Stack>
                      <Typography variant="body1" fontWeight="medium">
                        {customer.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {customer.id} • Age {getCustomerAge(customer.birthday)}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={0.5}>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Phone sx={{ fontSize: 14, color: "text.secondary" }} />
                      <Typography variant="body2">{customer.phone}</Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Email sx={{ fontSize: 14, color: "text.secondary" }} />
                      <Typography variant="body2" color="text.secondary">
                        {customer.email}
                      </Typography>
                    </Stack>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack spacing={1}>
                    <Chip
                      label={
                        customer.tier.charAt(0).toUpperCase() +
                        customer.tier.slice(1)
                      }
                      color={getTierColor(customer.tier)}
                      size="small"
                    />
                    <Chip
                      label={
                        customer.status.charAt(0).toUpperCase() +
                        customer.status.slice(1)
                      }
                      color={getStatusColor(customer.status)}
                      size="small"
                      variant="outlined"
                    />
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack>
                    <Typography variant="body1" fontWeight="medium">
                      {customer.totalOrders} orders
                    </Typography>
                    <Typography
                      variant="body2"
                      color="success.main"
                      fontWeight="medium"
                    >
                      {formatCurrency(customer.totalSpent)}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Avg: {formatCurrency(customer.averageOrderValue)}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CardGiftcard
                      sx={{ fontSize: 16, color: "warning.main" }}
                    />
                    <Typography variant="body1" fontWeight="medium">
                      {customer.loyaltyPoints.toLocaleString()}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {formatDate(customer.lastOrderDate)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Rating
                      value={customer.rating}
                      precision={0.1}
                      size="small"
                      readOnly
                    />
                    <Typography variant="caption" color="text.secondary">
                      {customer.rating}
                    </Typography>
                  </Stack>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={1}>
                    <IconButton
                      size="small"
                      onClick={() => handleCallCustomer(customer.phone)}
                      title="Call Customer"
                    >
                      <Phone />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleEmailCustomer(customer.email)}
                      title="Email Customer"
                    >
                      <Email />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={() => handleViewDetails(customer)}
                      title="View Profile"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      onClick={(e) => handleMenuClick(e, customer.id)}
                      title="More Actions"
                    >
                      <MoreVert />
                    </IconButton>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {filteredCustomers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No customers found matching your criteria
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Edit fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <History fontSize="small" />
          </ListItemIcon>
          <ListItemText>Order History</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <LocalOffer fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Offer</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <ListItemIcon>
            <Delete fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete Customer</ListItemText>
        </MenuItem>
      </Menu>

      {/* Customer Details Dialog */}
      <Dialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        {selectedCustomer && (
          <>
            <DialogTitle>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar
                    sx={{ bgcolor: "primary.main", width: 48, height: 48 }}
                  >
                    {selectedCustomer.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </Avatar>
                  <Stack>
                    <Typography variant="h6">
                      {selectedCustomer.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Customer ID: {selectedCustomer.id}
                    </Typography>
                  </Stack>
                </Stack>
                <IconButton onClick={() => setDetailsOpen(false)}>
                  <Close />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              {/* Tabs */}
              <Tabs
                value={activeTab}
                onChange={(_, newValue) => setActiveTab(newValue)}
                sx={{ mb: 3 }}
              >
                <Tab label="Profile" />
                <Tab label="Order History" />
                <Tab label="Loyalty & Rewards" />
              </Tabs>

              {/* Profile Tab */}
              {activeTab === 0 && (
                <Grid container spacing={3}>
                  {/* Personal Information */}
                  <Grid size={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Personal Information
                        </Typography>
                        <Stack spacing={2}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Full Name:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedCustomer.name}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Email:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedCustomer.email}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Phone:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedCustomer.phone}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Birthday:
                            </Typography>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Cake
                                sx={{ fontSize: 16, color: "warning.main" }}
                              />
                              <Typography variant="body2" fontWeight="medium">
                                {formatDate(selectedCustomer.birthday)} (
                                {getCustomerAge(selectedCustomer.birthday)}{" "}
                                years)
                              </Typography>
                            </Stack>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Member Since:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {formatDate(selectedCustomer.joinedDate)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Status & Tier */}
                  <Grid size={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Status & Tier
                        </Typography>
                        <Stack spacing={2}>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" color="text.secondary">
                              Status:
                            </Typography>
                            <Chip
                              label={
                                selectedCustomer.status
                                  .charAt(0)
                                  .toUpperCase() +
                                selectedCustomer.status.slice(1)
                              }
                              color={getStatusColor(selectedCustomer.status)}
                              size="small"
                            />
                          </Stack>
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                          >
                            <Typography variant="body2" color="text.secondary">
                              Tier:
                            </Typography>
                            <Chip
                              label={
                                selectedCustomer.tier.charAt(0).toUpperCase() +
                                selectedCustomer.tier.slice(1)
                              }
                              color={getTierColor(selectedCustomer.tier)}
                              size="small"
                            />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Rating:
                            </Typography>
                            <Stack
                              direction="row"
                              alignItems="center"
                              spacing={1}
                            >
                              <Rating
                                value={selectedCustomer.rating}
                                precision={0.1}
                                size="small"
                                readOnly
                              />
                              <Typography variant="body2" fontWeight="medium">
                                {selectedCustomer.rating}
                              </Typography>
                            </Stack>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Total Visits:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedCustomer.visits}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Spending Summary */}
                  <Grid size={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Spending Summary
                        </Typography>
                        <Stack spacing={2}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Total Orders:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedCustomer.totalOrders}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Total Spent:
                            </Typography>
                            <Typography
                              variant="body2"
                              fontWeight="medium"
                              color="success.main"
                            >
                              {formatCurrency(selectedCustomer.totalSpent)}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Average Order:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {formatCurrency(
                                selectedCustomer.averageOrderValue
                              )}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Last Order:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {formatDate(selectedCustomer.lastOrderDate)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Preferences */}
                  <Grid size={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Preferences & Notes
                        </Typography>
                        <Stack spacing={2}>

                          <Stack>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Preferences:
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                              {selectedCustomer.preferences.map(
                                (pref: string, index: number) => (
                                  <Chip
                                    key={index}
                                    label={pref.replace("_", " ")}
                                    size="small"
                                    color="primary"
                                  />
                                )
                              )}
                            </Stack>
                          </Stack>
                          <Stack>
                            <Typography
                              variant="body2"
                              color="text.secondary"
                              gutterBottom
                            >
                              Notes:
                            </Typography>
                            <Typography variant="body2">
                              {selectedCustomer.notes}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Order History Tab */}
              {activeTab === 1 && (
                <Card variant="outlined">
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Order History
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Order history table would be implemented here showing:
                    </Typography>
                    <Stack spacing={1} mt={2}>
                      <Typography variant="body2">
                        • Order date and time
                      </Typography>
                      <Typography variant="body2">
                        • Order items and quantities
                      </Typography>
                      <Typography variant="body2">
                        • Order total and payment method
                      </Typography>
                      <Typography variant="body2">
                        • Order status and delivery details
                      </Typography>
                      <Typography variant="body2">
                        • Customer feedback and ratings
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              )}

              {/* Loyalty & Rewards Tab */}
              {activeTab === 2 && (
                <Grid container spacing={3}>
                  <Grid size={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Loyalty Points
                        </Typography>
                        <Stack alignItems="center" spacing={2}>
                          <Typography
                            variant="h3"
                            color="warning.main"
                            fontWeight="bold"
                          >
                            {selectedCustomer.loyaltyPoints.toLocaleString()}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Available Points
                          </Typography>
                          <Button
                            variant="outlined"
                            startIcon={<CardGiftcard />}
                          >
                            Redeem Points
                          </Button>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Rewards & Benefits
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Based on {selectedCustomer.tier} tier membership:
                        </Typography>
                        <Stack spacing={1} mt={2}>
                          <Typography variant="body2">
                            •{" "}
                            {selectedCustomer.tier === "platinum"
                              ? "20%"
                              : selectedCustomer.tier === "gold"
                              ? "15%"
                              : selectedCustomer.tier === "silver"
                              ? "10%"
                              : "5%"}{" "}
                            discount on all orders
                          </Typography>
                          <Typography variant="body2">
                            • Priority reservations
                          </Typography>
                          <Typography variant="body2">
                            • Birthday special offers
                          </Typography>
                          <Typography variant="body2">
                            • Exclusive event invitations
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>Close</Button>
              <Button
                startIcon={<Phone />}
                onClick={() => handleCallCustomer(selectedCustomer.phone)}
              >
                Call
              </Button>
              <Button
                startIcon={<Email />}
                onClick={() => handleEmailCustomer(selectedCustomer.email)}
              >
                Email
              </Button>
              <Button variant="contained" startIcon={<Edit />}>
                Edit Profile
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </PageLayout>
  );
};
