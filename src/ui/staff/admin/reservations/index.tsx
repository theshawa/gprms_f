import {
  EventAvailable,
  Event,
  Person,
  Phone,
  AccessTime,
  TableRestaurant,
  Group,
  Search,
  FilterList,
  CalendarToday,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  Schedule,
  Close,
  ViewWeek,
  ViewList,
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
  Badge,
  Tabs,
  Tab,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import type { FC } from "react";
import { useState, useMemo } from "react";
import { PageLayout } from "../../shared/page-layout";

// Mock data for reservations
const mockReservations = [
  {
    id: "RES-001",
    customerName: "Suresh Bandara",
    customerPhone: "+94 77 123 4567",
    customerEmail: "suresh.bandara@email.com",
    date: "2024-07-22",
    time: "19:00",
    guests: 4,
    table: "A-12",
    status: "confirmed",
    specialRequests: "Birthday celebration - need cake",
    createdAt: "2024-07-20T10:30:00",
    notes: "Regular customer, prefers window table",
  },
  {
    id: "RES-002",
    customerName: "Nayomi Silva",
    customerPhone: "+94 71 456 7890",
    customerEmail: "nayomi.silva@email.com",
    date: "2024-07-22",
    time: "20:30",
    guests: 2,
    table: "B-05",
    status: "pending",
    specialRequests: "Vegetarian menu required",
    createdAt: "2024-07-21T14:15:00",
    notes: "",
  },
  {
    id: "RES-003",
    customerName: "Kasun Perera",
    customerPhone: "+94 76 987 6543",
    customerEmail: "kasun.perera@email.com",
    date: "2024-07-23",
    time: "18:30",
    guests: 6,
    table: "C-15",
    status: "confirmed",
    specialRequests: "Business dinner - quiet area preferred",
    createdAt: "2024-07-19T16:45:00",
    notes: "Important client, ensure excellent service",
  },
  {
    id: "RES-004",
    customerName: "Anushka Fernando",
    customerPhone: "+94 75 234 5678",
    customerEmail: "anushka.fernando@email.com",
    date: "2024-07-23",
    time: "19:30",
    guests: 3,
    table: "D-08",
    status: "cancelled",
    specialRequests: "",
    createdAt: "2024-07-21T09:20:00",
    notes: "Customer cancelled due to family emergency",
  },
  {
    id: "RES-005",
    customerName: "Pradeep Jayawardena",
    customerPhone: "+94 77 876 5432",
    customerEmail: "pradeep.j@email.com",
    date: "2024-07-24",
    time: "20:00",
    guests: 8,
    table: "Private Room 1",
    status: "confirmed",
    specialRequests: "Anniversary dinner - romantic setup needed",
    createdAt: "2024-07-18T11:00:00",
    notes: "25th wedding anniversary, VIP treatment",
  },
  {
    id: "RES-006",
    customerName: "Chamari Wickramasinghe",
    customerPhone: "+94 71 345 6789",
    customerEmail: "chamari.w@email.com",
    date: "2024-07-24",
    time: "18:00",
    guests: 5,
    table: "B-12",
    status: "pending",
    specialRequests: "Children's high chairs needed",
    createdAt: "2024-07-21T13:30:00",
    notes: "Family with small children",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "confirmed": return "success";
    case "pending": return "warning";
    case "cancelled": return "error";
    case "completed": return "default";
    default: return "default";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "confirmed": return <CheckCircle />;
    case "pending": return <Schedule />;
    case "cancelled": return <Cancel />;
    case "completed": return <EventAvailable />;
    default: return <Event />;
  }
};

const formatPhoneNumber = (phone: string) => {
  return phone.replace(/(\+94)(\d{2})(\d{3})(\d{4})/, "$1 $2 $3 $4");
};

const formatTime = (time: string) => {
  return new Date(`2024-01-01T${time}`).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
};

export const Admin_ReservationsHomePage: FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [viewMode, setViewMode] = useState<"list" | "calendar">("list");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedReservation, setSelectedReservation] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newReservationOpen, setNewReservationOpen] = useState(false);

  const filteredReservations = useMemo(() => {
    return mockReservations.filter((reservation) => {
      const matchesSearch = 
        reservation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.customerPhone.includes(searchTerm) ||
        reservation.table.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || reservation.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== "all") {
        const today = new Date();
        const reservationDate = new Date(reservation.date);
        
        switch (dateFilter) {
          case "today":
            matchesDate = reservationDate.toDateString() === today.toDateString();
            break;
          case "tomorrow":
            const tomorrow = new Date(today);
            tomorrow.setDate(today.getDate() + 1);
            matchesDate = reservationDate.toDateString() === tomorrow.toDateString();
            break;
          case "week":
            const weekFromNow = new Date(today);
            weekFromNow.setDate(today.getDate() + 7);
            matchesDate = reservationDate >= today && reservationDate <= weekFromNow;
            break;
        }
      }

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [searchTerm, statusFilter, dateFilter]);

  const statusCounts = useMemo(() => {
    const counts = { confirmed: 0, pending: 0, cancelled: 0, completed: 0 };
    mockReservations.forEach(reservation => {
      counts[reservation.status as keyof typeof counts]++;
    });
    return counts;
  }, []);

  const upcomingReservations = useMemo(() => {
    const today = new Date();
    return mockReservations.filter(res => {
      const resDate = new Date(res.date);
      return resDate >= today && res.status === "confirmed";
    }).length;
  }, []);

  const handleViewDetails = (reservation: any) => {
    setSelectedReservation(reservation);
    setDetailsOpen(true);
  };

  const handleUpdateStatus = (reservationId: string, newStatus: string) => {
    console.log(`Updating reservation ${reservationId} to status: ${newStatus}`);
  };

  const handleCallCustomer = (phone: string) => {
    window.open(`tel:${phone}`);
  };

  const todaysReservations = useMemo(() => {
    const today = new Date().toDateString();
    return mockReservations.filter(res => 
      new Date(res.date).toDateString() === today && 
      res.status === "confirmed"
    );
  }, []);

  return (
    <PageLayout
      title="Reservations"
      subtitle="Manage table reservations and bookings"
      button={{
        text: "New Reservation",
        icon: <Add />,
        onClick: () => setNewReservationOpen(true),
      }}
    >
      {/* Stats Overview */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {upcomingReservations}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Upcoming
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {statusCounts.confirmed}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Confirmed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
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
                {todaysReservations.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Today
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* View Mode Toggle */}
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={(_, newMode) => newMode && setViewMode(newMode)}
          size="small"
        >
          <ToggleButton value="list">
            <ViewList sx={{ mr: 1 }} />
            List View
          </ToggleButton>
          <ToggleButton value="calendar">
            <CalendarToday sx={{ mr: 1 }} />
            Calendar View
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search reservations..."
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
                  <MenuItem value="confirmed">Confirmed</MenuItem>
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Date</InputLabel>
                <Select
                  value={dateFilter}
                  label="Date"
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <MenuItem value="all">All Dates</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="tomorrow">Tomorrow</MenuItem>
                  <MenuItem value="week">This Week</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setDateFilter("all");
                }}
              >
                Reset Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reservations Table */}
      {viewMode === "list" && (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Reservation ID</TableCell>
                <TableCell>Customer</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Table</TableCell>
                <TableCell>Guests</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Special Requests</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReservations.map((reservation) => (
                <TableRow key={reservation.id} hover>
                  <TableCell>
                    <Typography variant="body1" fontWeight="medium">
                      {reservation.id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack>
                      <Typography variant="body1" fontWeight="medium">
                        {reservation.customerName}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2" color="text.secondary">
                          {formatPhoneNumber(reservation.customerPhone)}
                        </Typography>
                      </Stack>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack>
                      <Typography variant="body1" fontWeight="medium">
                        {formatDate(reservation.date)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatTime(reservation.time)}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <TableRestaurant sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body1">
                        {reservation.table}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Group sx={{ fontSize: 16, color: "text.secondary" }} />
                      <Typography variant="body1">
                        {reservation.guests}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={getStatusIcon(reservation.status)}
                      label={reservation.status.charAt(0).toUpperCase() + reservation.status.slice(1)}
                      color={getStatusColor(reservation.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{
                        maxWidth: 200,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      }}
                    >
                      {reservation.specialRequests || "None"}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" spacing={1}>
                      <IconButton
                        size="small"
                        onClick={() => handleCallCustomer(reservation.customerPhone)}
                        title="Call Customer"
                      >
                        <Phone />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleViewDetails(reservation)}
                        title="View Details"
                      >
                        <Event />
                      </IconButton>
                      {reservation.status === "pending" && (
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateStatus(reservation.id, "confirmed")}
                          title="Confirm Reservation"
                          color="success"
                        >
                          <CheckCircle />
                        </IconButton>
                      )}
                      {reservation.status !== "cancelled" && reservation.status !== "completed" && (
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateStatus(reservation.id, "cancelled")}
                          title="Cancel Reservation"
                          color="error"
                        >
                          <Cancel />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
              {filteredReservations.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="text.secondary">
                      No reservations found matching your criteria
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Calendar View
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Calendar functionality would be implemented here using a calendar library like @mui/x-date-pickers or react-big-calendar
            </Typography>
            <Grid container spacing={2}>
              {todaysReservations.map((reservation) => (
                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={reservation.id}>
                  <Card variant="outlined" sx={{ cursor: "pointer" }} onClick={() => handleViewDetails(reservation)}>
                    <CardContent sx={{ pb: "16px !important" }}>
                      <Stack direction="row" justifyContent="space-between" alignItems="start" mb={1}>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {formatTime(reservation.time)}
                        </Typography>
                        <Chip
                          label={reservation.status}
                          color={getStatusColor(reservation.status)}
                          size="small"
                        />
                      </Stack>
                      <Typography variant="body1" fontWeight="medium" gutterBottom>
                        {reservation.customerName}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <TableRestaurant sx={{ fontSize: 14 }} />
                          <Typography variant="caption">
                            {reservation.table}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={0.5}>
                          <Group sx={{ fontSize: 14 }} />
                          <Typography variant="caption">
                            {reservation.guests}
                          </Typography>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Reservation Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="md"
        fullWidth
      >
        {selectedReservation && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6">
                  Reservation Details - {selectedReservation.id}
                </Typography>
                <IconButton onClick={() => setDetailsOpen(false)}>
                  <Close />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3}>
                {/* Customer Information */}
                <Grid size={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Customer Information
                      </Typography>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            <Person />
                          </Avatar>
                          <Stack>
                            <Typography variant="body1" fontWeight="medium">
                              {selectedReservation.customerName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedReservation.customerEmail}
                            </Typography>
                          </Stack>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Phone sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2">
                            {formatPhoneNumber(selectedReservation.customerPhone)}
                          </Typography>
                          <IconButton 
                            size="small" 
                            onClick={() => handleCallCustomer(selectedReservation.customerPhone)}
                          >
                            <Phone sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Reservation Details */}
                <Grid size={6}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        Reservation Details
                      </Typography>
                      <Stack spacing={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <CalendarToday sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2">
                            {formatDate(selectedReservation.date)} at {formatTime(selectedReservation.time)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <TableRestaurant sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2">
                            Table: {selectedReservation.table}
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Group sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2">
                            {selectedReservation.guests} guests
                          </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Typography variant="body2" color="text.secondary">
                            Status:
                          </Typography>
                          <Chip
                            icon={getStatusIcon(selectedReservation.status)}
                            label={selectedReservation.status.charAt(0).toUpperCase() + selectedReservation.status.slice(1)}
                            color={getStatusColor(selectedReservation.status)}
                            size="small"
                          />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Special Requests */}
                {selectedReservation.specialRequests && (
                  <Grid size={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Special Requests
                        </Typography>
                        <Typography variant="body1">
                          {selectedReservation.specialRequests}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}

                {/* Internal Notes */}
                {selectedReservation.notes && (
                  <Grid size={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Internal Notes
                        </Typography>
                        <Typography variant="body1">
                          {selectedReservation.notes}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                )}
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              <Button 
                startIcon={<Phone />}
                onClick={() => handleCallCustomer(selectedReservation.customerPhone)}
              >
                Call Customer
              </Button>
              {selectedReservation.status === "pending" && (
                <Button 
                  variant="contained"
                  color="success"
                  startIcon={<CheckCircle />}
                  onClick={() => {
                    handleUpdateStatus(selectedReservation.id, "confirmed");
                    setDetailsOpen(false);
                  }}
                >
                  Confirm
                </Button>
              )}
              {selectedReservation.status !== "cancelled" && selectedReservation.status !== "completed" && (
                <Button 
                  variant="outlined"
                  color="error"
                  startIcon={<Cancel />}
                  onClick={() => {
                    handleUpdateStatus(selectedReservation.id, "cancelled");
                    setDetailsOpen(false);
                  }}
                >
                  Cancel
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Reservation Dialog Placeholder */}
      <Dialog
        open={newReservationOpen}
        onClose={() => setNewReservationOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              New Reservation
            </Typography>
            <IconButton onClick={() => setNewReservationOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            New reservation form would be implemented here with customer details, date/time selection, table assignment, and special requests.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewReservationOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Create Reservation
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};
