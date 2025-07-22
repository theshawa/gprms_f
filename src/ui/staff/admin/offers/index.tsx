import {
  LocalOfferSharp,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  TrendingUp,
  AttachMoney,
  People,
  Schedule,
  Search,
  FilterList,
  Close,
  Percent,
  MonetizationOn,
  CalendarToday,
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
  Switch,
  FormControlLabel,
  LinearProgress,
} from "@mui/material";
import type { FC } from "react";
import { useState, useMemo } from "react";
import { PageLayout } from "../../shared/page-layout";

// Mock data for offers
const mockOffers = [
  {
    id: "OFF-001",
    title: "Happy Hour Special",
    description: "20% off on all beverages from 4 PM to 6 PM",
    type: "percentage",
    value: 20,
    minOrderAmount: 1500,
    maxDiscount: 500,
    validFrom: "2024-07-15",
    validTo: "2024-08-15",
    status: "active",
    category: "beverages",
    usageCount: 145,
    usageLimit: 1000,
    totalSavings: 87500,
    revenue: 312500,
    code: "HAPPY20",
    applicableOn: "beverages",
    targetCustomers: "all",
  },
  {
    id: "OFF-002",
    title: "Weekend Family Deal",
    description: "LKR 1000 off on orders above LKR 5000 during weekends",
    type: "fixed",
    value: 1000,
    minOrderAmount: 5000,
    maxDiscount: 1000,
    validFrom: "2024-07-01",
    validTo: "2024-07-31",
    status: "active",
    category: "family",
    usageCount: 89,
    usageLimit: 500,
    totalSavings: 89000,
    revenue: 445000,
    code: "FAMILY1000",
    applicableOn: "all_items",
    targetCustomers: "families",
  },
  {
    id: "OFF-003",
    title: "New Customer Welcome",
    description: "15% off for first-time customers",
    type: "percentage",
    value: 15,
    minOrderAmount: 2000,
    maxDiscount: 750,
    validFrom: "2024-06-01",
    validTo: "2024-12-31",
    status: "active",
    category: "welcome",
    usageCount: 67,
    usageLimit: 1000,
    totalSavings: 34500,
    revenue: 195750,
    code: "WELCOME15",
    applicableOn: "all_items",
    targetCustomers: "new",
  },
  {
    id: "OFF-004",
    title: "Lunch Time Combo",
    description: "Buy any main course and get 50% off on dessert",
    type: "percentage",
    value: 50,
    minOrderAmount: 1000,
    maxDiscount: 400,
    validFrom: "2024-07-10",
    validTo: "2024-07-25",
    status: "expired",
    category: "combo",
    usageCount: 234,
    usageLimit: 300,
    totalSavings: 46800,
    revenue: 234000,
    code: "LUNCH50",
    applicableOn: "desserts",
    targetCustomers: "all",
  },
  {
    id: "OFF-005",
    title: "Birthday Special",
    description: "Free birthday cake with any order above LKR 3000",
    type: "gift",
    value: 0,
    minOrderAmount: 3000,
    maxDiscount: 1200,
    validFrom: "2024-01-01",
    validTo: "2024-12-31",
    status: "paused",
    category: "birthday",
    usageCount: 45,
    usageLimit: 500,
    totalSavings: 54000,
    revenue: 135000,
    code: "BIRTHDAY",
    applicableOn: "gifts",
    targetCustomers: "birthday",
  },
  {
    id: "OFF-006",
    title: "Student Discount",
    description: "10% off for students with valid ID",
    type: "percentage",
    value: 10,
    minOrderAmount: 800,
    maxDiscount: 300,
    validFrom: "2024-07-01",
    validTo: "2024-08-31",
    status: "scheduled",
    category: "student",
    usageCount: 0,
    usageLimit: 2000,
    totalSavings: 0,
    revenue: 0,
    code: "STUDENT10",
    applicableOn: "all_items",
    targetCustomers: "students",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "success";
    case "paused": return "warning";
    case "expired": return "error";
    case "scheduled": return "info";
    default: return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "active": return <Visibility />;
    case "paused": return <VisibilityOff />;
    case "expired": return <Schedule />;
    case "scheduled": return <CalendarToday />;
    default: return <LocalOfferSharp />;
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case "percentage": return <Percent />;
    case "fixed": return <MonetizationOn />;
    case "gift": return <LocalOfferSharp />;
    default: return <LocalOfferSharp />;
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

const getUsagePercentage = (used: number, limit: number) => {
  return Math.round((used / limit) * 100);
};

export const Admin_ManageOffersHomePage: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newOfferOpen, setNewOfferOpen] = useState(false);

  const filteredOffers = useMemo(() => {
    return mockOffers.filter((offer) => {
      const matchesSearch = 
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.code.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || offer.status === statusFilter;
      const matchesType = typeFilter === "all" || offer.type === typeFilter;

      return matchesSearch && matchesStatus && matchesType;
    });
  }, [searchTerm, statusFilter, typeFilter]);

  const statusCounts = useMemo(() => {
    const counts = { active: 0, paused: 0, expired: 0, scheduled: 0, total: 0 };
    mockOffers.forEach(offer => {
      counts[offer.status as keyof typeof counts]++;
      counts.total++;
    });
    return counts;
  }, []);

  const totalStats = useMemo(() => {
    const stats = {
      totalSavings: 0,
      totalRevenue: 0,
      totalUsage: 0,
      avgUsageRate: 0,
    };
    
    mockOffers.forEach(offer => {
      stats.totalSavings += offer.totalSavings;
      stats.totalRevenue += offer.revenue;
      stats.totalUsage += offer.usageCount;
    });
    
    const totalUsageLimit = mockOffers.reduce((sum, offer) => sum + offer.usageLimit, 0);
    stats.avgUsageRate = Math.round((stats.totalUsage / totalUsageLimit) * 100);
    
    return stats;
  }, []);

  const handleViewDetails = (offer: any) => {
    setSelectedOffer(offer);
    setDetailsOpen(true);
  };

  const handleToggleStatus = (offerId: string) => {
    console.log(`Toggling status for offer ${offerId}`);
  };

  const handleDeleteOffer = (offerId: string) => {
    console.log(`Deleting offer ${offerId}`);
  };

  return (
      <PageLayout
      title="Offers & Promotions"
      subtitle="Create and manage promotional offers to boost sales"
        button={{
          text: "New Offer",
        icon: <Add />,
        onClick: () => setNewOfferOpen(true),
      }}
    >
      {/* Stats Overview */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {statusCounts.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Offers
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {formatCurrency(totalStats.totalRevenue).replace('LKR ', '')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Revenue Generated
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {formatCurrency(totalStats.totalSavings).replace('LKR ', '')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Customer Savings
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {totalStats.avgUsageRate}%
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Usage Rate
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
                placeholder="Search offers..."
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
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="paused">Paused</MenuItem>
                  <MenuItem value="expired">Expired</MenuItem>
                  <MenuItem value="scheduled">Scheduled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={typeFilter}
                  label="Type"
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <MenuItem value="all">All Types</MenuItem>
                  <MenuItem value="percentage">Percentage</MenuItem>
                  <MenuItem value="fixed">Fixed Amount</MenuItem>
                  <MenuItem value="gift">Gift/Free Item</MenuItem>
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
                  setTypeFilter("all");
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Offers Grid */}
      <Grid container spacing={3}>
        {filteredOffers.map((offer) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={offer.id}>
            <Card 
              sx={{ 
                height: "100%", 
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                }
              }}
              onClick={() => handleViewDetails(offer)}
            >
              <CardContent>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 32, height: 32 }}>
                      {getTypeIcon(offer.type)}
                    </Avatar>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {offer.title}
                    </Typography>
                  </Stack>
                  <Chip
                    icon={getStatusIcon(offer.status)}
                    label={offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                    color={getStatusColor(offer.status)}
                    size="small"
                  />
                </Stack>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {offer.description}
                </Typography>

                {/* Offer Details */}
                <Stack spacing={1} mb={2}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Code:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {offer.code}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Discount:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {offer.type === "percentage" 
                        ? `${offer.value}%` 
                        : offer.type === "fixed" 
                        ? formatCurrency(offer.value)
                        : "Free Item"
                      }
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Min Order:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatCurrency(offer.minOrderAmount)}
                    </Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" color="text.secondary">
                      Valid Until:
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {formatDate(offer.validTo)}
                    </Typography>
                  </Stack>
                </Stack>

                {/* Usage Progress */}
                <Stack spacing={1} mb={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Usage
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {offer.usageCount} / {offer.usageLimit}
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={getUsagePercentage(offer.usageCount, offer.usageLimit)} 
                    sx={{ height: 6, borderRadius: 3 }}
                    color={getUsagePercentage(offer.usageCount, offer.usageLimit) > 80 ? "warning" : "primary"}
                  />
                </Stack>

                {/* Performance Stats */}
                <Grid container spacing={2} mb={2}>
                  <Grid size={6}>
                    <Stack alignItems="center">
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                        {formatCurrency(offer.revenue).replace('LKR ', '')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Revenue
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={6}>
                    <Stack alignItems="center">
                      <Typography variant="h6" color="warning.main" fontWeight="bold">
                        {formatCurrency(offer.totalSavings).replace('LKR ', '')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Savings
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Actions */}
                <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Edit />}
                    sx={{ flex: 1 }}
                    onClick={() => handleViewDetails(offer)}
                  >
                    Edit
                  </Button>
                  {offer.status === "active" ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      startIcon={<VisibilityOff />}
                      onClick={() => handleToggleStatus(offer.id)}
                    >
                      Pause
                    </Button>
                  ) : offer.status === "paused" ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      startIcon={<Visibility />}
                      onClick={() => handleToggleStatus(offer.id)}
                    >
                      Activate
                    </Button>
                  ) : null}
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteOffer(offer.id)}
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {filteredOffers.length === 0 && (
          <Grid size={12}>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <LocalOfferSharp sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No offers found
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Create your first promotional offer to boost sales
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setNewOfferOpen(true)}
                >
                  Create Offer
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Offer Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedOffer && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  {selectedOffer.title}
                </Typography>
                <IconButton onClick={() => setDetailsOpen(false)}>
                  <Close />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Basic Information */}
                <Grid size={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Basic Information
                      </Typography>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Offer Code:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {selectedOffer.code}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Type:
                          </Typography>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            {getTypeIcon(selectedOffer.type)}
                            <Typography variant="body2" fontWeight="medium">
                              {selectedOffer.type.charAt(0).toUpperCase() + selectedOffer.type.slice(1)}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Status:
                          </Typography>
                          <Chip
                            icon={getStatusIcon(selectedOffer.status)}
                            label={selectedOffer.status.charAt(0).toUpperCase() + selectedOffer.status.slice(1)}
                            color={getStatusColor(selectedOffer.status)}
                            size="small"
                          />
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Category:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {selectedOffer.category.charAt(0).toUpperCase() + selectedOffer.category.slice(1)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Discount Details */}
                <Grid size={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Discount Details
                      </Typography>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Discount Value:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {selectedOffer.type === "percentage" 
                              ? `${selectedOffer.value}%` 
                              : selectedOffer.type === "fixed" 
                              ? formatCurrency(selectedOffer.value)
                              : "Free Item"
                            }
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Min Order Amount:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(selectedOffer.minOrderAmount)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Max Discount:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatCurrency(selectedOffer.maxDiscount)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Applicable On:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {selectedOffer.applicableOn.replace('_', ' ').charAt(0).toUpperCase() + selectedOffer.applicableOn.replace('_', ' ').slice(1)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Validity Period */}
                <Grid size={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Validity Period
                      </Typography>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Valid From:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatDate(selectedOffer.validFrom)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Valid To:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {formatDate(selectedOffer.validTo)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Target Customers:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {selectedOffer.targetCustomers.charAt(0).toUpperCase() + selectedOffer.targetCustomers.slice(1)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Performance Metrics */}
                <Grid size={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Performance Metrics
                      </Typography>
                      <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Times Used:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium">
                            {selectedOffer.usageCount} / {selectedOffer.usageLimit}
                          </Typography>
                        </Stack>
                        <LinearProgress 
                          variant="determinate" 
                          value={getUsagePercentage(selectedOffer.usageCount, selectedOffer.usageLimit)} 
                          sx={{ height: 8, borderRadius: 4 }}
                          color={getUsagePercentage(selectedOffer.usageCount, selectedOffer.usageLimit) > 80 ? "warning" : "primary"}
                        />
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Revenue Generated:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium" color="success.main">
                            {formatCurrency(selectedOffer.revenue)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Customer Savings:
                          </Typography>
                          <Typography variant="body2" fontWeight="medium" color="warning.main">
                            {formatCurrency(selectedOffer.totalSavings)}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Description */}
                <Grid size={12}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Description
                      </Typography>
                      <Typography variant="body1">
                        {selectedOffer.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              <Button variant="outlined" startIcon={<Edit />}>
                Edit Offer
              </Button>
              {selectedOffer.status === "active" ? (
                <Button 
                  variant="outlined"
                  color="warning"
                  startIcon={<VisibilityOff />}
                  onClick={() => {
                    handleToggleStatus(selectedOffer.id);
                    setDetailsOpen(false);
                  }}
                >
                  Pause Offer
                </Button>
              ) : selectedOffer.status === "paused" ? (
                <Button 
                  variant="contained"
                  color="success"
                  startIcon={<Visibility />}
                  onClick={() => {
                    handleToggleStatus(selectedOffer.id);
                    setDetailsOpen(false);
                  }}
                >
                  Activate Offer
                </Button>
              ) : null}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Offer Dialog Placeholder */}
      <Dialog
        open={newOfferOpen}
        onClose={() => setNewOfferOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Create New Offer
            </Typography>
            <IconButton onClick={() => setNewOfferOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create new promotional offers with the following form fields:
          </Typography>
          <Stack spacing={2}>
            <Typography variant="body2">• Offer title and description</Typography>
            <Typography variant="body2">• Discount type (percentage, fixed amount, or free item)</Typography>
            <Typography variant="body2">• Discount value and maximum discount amount</Typography>
            <Typography variant="body2">• Minimum order requirements</Typography>
            <Typography variant="body2">• Validity period (start and end dates)</Typography>
            <Typography variant="body2">• Usage limits and target customer segments</Typography>
            <Typography variant="body2">• Applicable categories or items</Typography>
            <Typography variant="body2">• Promotional code generation</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewOfferOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Create Offer
          </Button>
        </DialogActions>
      </Dialog>
      </PageLayout>
  );
};
