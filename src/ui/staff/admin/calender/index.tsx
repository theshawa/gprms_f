import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  AccessTime,
  Block,
  CalendarToday,
  ChevronLeft,
  ChevronRight,
  Close,
  Event,
  Group,
  Restaurant,
} from "@mui/icons-material";
import { type FC, useState, useMemo } from "react";
import { PageLayout } from "../../shared/page-layout";
import { sampleReservations, sampleClosures, type CalendarReservation, type RestaurantClosure } from "./sample-data";

export const Admin_CalenderPage: FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar");
  
  // Dialog states
  const [closureDialogOpen, setClosureDialogOpen] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<CalendarReservation | null>(null);
  const [reservationDialogOpen, setReservationDialogOpen] = useState(false);
  
  // Closure form state
  const [closureForm, setClosureForm] = useState({
    date: "",
    startTime: "",
    endTime: "",
    isFullDay: false,
    reason: "",
    description: "",
  });

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
  };

  const getDaysInMonth = (date: Date): Date[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: Date[] = [];

    // Add empty days for start of month
    const startPadding = firstDay.getDay();
    for (let i = 0; i < startPadding; i++) {
      days.push(new Date(year, month, -startPadding + i + 1));
    }

    // Add all days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }

    // Add empty days for end of month
    const endPadding = 42 - days.length; // 6 weeks * 7 days
    for (let i = 1; i <= endPadding; i++) {
      days.push(new Date(year, month + 1, i));
    }

    return days;
  };

  const getReservationsForDate = (date: Date): CalendarReservation[] => {
    const dateStr = formatDate(date);
    return sampleReservations.filter(reservation => {
      const reservationDate = new Date(reservation.reservationTime).toISOString().split('T')[0];
      return reservationDate === dateStr;
    });
  };

  const getClosuresForDate = (date: Date): RestaurantClosure[] => {
    const dateStr = formatDate(date);
    return sampleClosures.filter(closure => closure.date === dateStr);
  };

  const selectedDateReservations = useMemo(() => {
    return getReservationsForDate(selectedDate);
  }, [selectedDate]);

  const selectedDateClosures = useMemo(() => {
    return getClosuresForDate(selectedDate);
  }, [selectedDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  const handleClosureSubmit = () => {
    // In a real app, this would make an API call
    console.log("Creating closure:", closureForm);
    setClosureDialogOpen(false);
    setClosureForm({
      date: "",
      startTime: "",
      endTime: "",
      isFullDay: false,
      reason: "",
      description: "",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Confirmed": return "success";
      case "Pending": return "warning";
      case "Cancelled": return "error";
      case "Completed": return "info";
      default: return "default";
    }
  };

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <>
      <PageLayout
        title="Restaurant Calendar"
        subtitle="View reservations and manage restaurant closures"
        button={{
          text: "Close Restaurant",
          icon: <Block />,
          onClick: () => setClosureDialogOpen(true),
        }}
      >
        {/* Calendar Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Box display="flex" alignItems="center" gap={2}>
            <IconButton onClick={() => navigateMonth('prev')}>
              <ChevronLeft />
            </IconButton>
            <Typography variant="h5" component="h2">
              {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </Typography>
            <IconButton onClick={() => navigateMonth('next')}>
              <ChevronRight />
            </IconButton>
          </Box>
          
          <Box display="flex" gap={1}>
            <Button
              variant={viewMode === "calendar" ? "contained" : "outlined"}
              onClick={() => setViewMode("calendar")}
              startIcon={<CalendarToday />}
            >
              Calendar
            </Button>
            <Button
              variant={viewMode === "list" ? "contained" : "outlined"}
              onClick={() => setViewMode("list")}
              startIcon={<Event />}
            >
              List
            </Button>
          </Box>
        </Box>

        <Grid container spacing={3}>
          {/* Calendar View */}
          <Grid size={8}>
            {viewMode === "calendar" ? (
              <Card>
                <CardContent>
                  {/* Calendar Grid */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: 1,
                      mb: 2,
                    }}
                  >
                    {/* Day Headers */}
                    {dayNames.map((day) => (
                      <Box
                        key={day}
                        textAlign="center"
                        py={1}
                        sx={{ fontWeight: "bold", color: "text.secondary" }}
                      >
                        {day}
                      </Box>
                    ))}
                    
                    {/* Calendar Days */}
                    {getDaysInMonth(currentMonth).map((day, index) => {
                      const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
                      const isSelected = isSameDay(day, selectedDate);
                      const isToday = isSameDay(day, new Date());
                      const reservations = getReservationsForDate(day);
                      const closures = getClosuresForDate(day);
                      
                      return (
                        <Paper
                          key={index}
                          elevation={isSelected ? 3 : 1}
                          sx={{
                            p: 1,
                            minHeight: 80,
                            cursor: isCurrentMonth ? "pointer" : "default",
                            bgcolor: isSelected ? "primary.50" : isCurrentMonth ? "background.paper" : "grey.50",
                            border: isToday ? 2 : 0,
                            borderColor: "primary.main",
                            opacity: isCurrentMonth ? 1 : 0.5,
                          }}
                          onClick={() => isCurrentMonth && setSelectedDate(day)}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: isToday ? "bold" : "normal",
                              color: isToday ? "primary.main" : "text.primary",
                            }}
                          >
                            {day.getDate()}
                          </Typography>
                          
                          {/* Reservations indicator */}
                          {reservations.length > 0 && (
                            <Chip
                              size="small"
                              label={reservations.length}
                              color="primary"
                              sx={{ fontSize: "0.7rem", height: 16 }}
                            />
                          )}
                          
                          {/* Closure indicator */}
                          {closures.length > 0 && (
                            <Chip
                              size="small"
                              label="Closed"
                              color="error"
                              sx={{ fontSize: "0.6rem", height: 16, mt: 0.5 }}
                            />
                          )}
                        </Paper>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            ) : (
              /* List View */
              <Card>
                <CardHeader title="All Reservations" />
                <CardContent>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Date & Time</TableCell>
                          <TableCell>Customer</TableCell>
                          <TableCell>Table</TableCell>
                          <TableCell>Guests</TableCell>
                          <TableCell>Status</TableCell>
                          <TableCell>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {sampleReservations.slice(0, 10).map((reservation) => (
                          <TableRow key={reservation.id}>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">
                                  {new Date(reservation.reservationTime).toLocaleDateString()}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {new Date(reservation.reservationTime).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Box>
                                <Typography variant="body2">{reservation.customerName}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {reservation.customerPhone}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">{reservation.tableNumber}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                {reservation.diningAreaName}
                              </Typography>
                            </TableCell>
                            <TableCell>{reservation.guestCount}</TableCell>
                            <TableCell>
                              <Chip
                                label={reservation.status}
                                color={getStatusColor(reservation.status) as any}
                                size="small"
                              />
                            </TableCell>
                            <TableCell>
                              <Button
                                size="small"
                                onClick={() => {
                                  setSelectedReservation(reservation);
                                  setReservationDialogOpen(true);
                                }}
                              >
                                View
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Selected Date Details */}
          <Grid size={4}>
            <Card>
              <CardHeader
                title={`${selectedDate.toLocaleDateString()} Details`}
                action={
                  <Chip
                    icon={<CalendarToday />}
                    label={selectedDate.toLocaleDateString('en-US', { weekday: 'long' })}
                    variant="outlined"
                  />
                }
              />
              <CardContent>
                {/* Closures for selected date */}
                {selectedDateClosures.length > 0 && (
                  <Box mb={3}>
                    <Typography variant="h6" gutterBottom color="error">
                      Restaurant Closures
                    </Typography>
                    {selectedDateClosures.map((closure) => (
                      <Card key={closure.id} variant="outlined" sx={{ mb: 1, bgcolor: "error.50" }}>
                        <CardContent sx={{ py: 1.5 }}>
                          <Box display="flex" alignItems="center" gap={1} mb={1}>
                            <Block color="error" fontSize="small" />
                            <Typography variant="body2" fontWeight="bold">
                              {closure.isFullDay ? "Full Day Closure" : `${closure.startTime} - ${closure.endTime}`}
                            </Typography>
                          </Box>
                          <Typography variant="body2" gutterBottom>
                            {closure.reason}
                          </Typography>
                          {closure.description && (
                            <Typography variant="caption" color="text.secondary">
                              {closure.description}
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}

                {/* Reservations for selected date */}
                <Typography variant="h6" gutterBottom>
                  Reservations ({selectedDateReservations.length})
                </Typography>
                
                {selectedDateReservations.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                    No reservations for this date
                  </Typography>
                ) : (
                  <Box>
                    {selectedDateReservations.map((reservation) => (
                      <Card
                        key={reservation.id}
                        variant="outlined"
                        sx={{ mb: 2, cursor: "pointer" }}
                        onClick={() => {
                          setSelectedReservation(reservation);
                          setReservationDialogOpen(true);
                        }}
                      >
                        <CardContent sx={{ py: 1.5 }}>
                          <Box display="flex" justifyContent="space-between" alignItems="start" mb={1}>
                            <Typography variant="body2" fontWeight="bold">
                              {reservation.customerName}
                            </Typography>
                            <Chip
                              label={reservation.status}
                              color={getStatusColor(reservation.status) as any}
                              size="small"
                            />
                          </Box>
                          
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <AccessTime fontSize="small" color="action" />
                            <Typography variant="caption">
                              {new Date(reservation.reservationTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center" gap={1} mb={0.5}>
                            <Restaurant fontSize="small" color="action" />
                            <Typography variant="caption">
                              {reservation.tableNumber} - {reservation.diningAreaName}
                            </Typography>
                          </Box>
                          
                          <Box display="flex" alignItems="center" gap={1}>
                            <Group fontSize="small" color="action" />
                            <Typography variant="caption">
                              {reservation.guestCount} guests • {reservation.buffetType}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </PageLayout>

      {/* Closure Dialog */}
      <Dialog open={closureDialogOpen} onClose={() => setClosureDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Close Restaurant</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Date"
            type="date"
            value={closureForm.date}
            onChange={(e) => setClosureForm(prev => ({ ...prev, date: e.target.value }))}
            InputLabelProps={{ shrink: true }}
            margin="normal"
          />
          
          <FormControlLabel
            control={
              <Switch
                checked={closureForm.isFullDay}
                onChange={(e) => setClosureForm(prev => ({ ...prev, isFullDay: e.target.checked }))}
              />
            }
            label="Full Day Closure"
            sx={{ mt: 2, mb: 1 }}
          />
          
          {!closureForm.isFullDay && (
            <Box display="flex" gap={2}>
              <TextField
                label="Start Time"
                type="time"
                value={closureForm.startTime}
                onChange={(e) => setClosureForm(prev => ({ ...prev, startTime: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
              <TextField
                label="End Time"
                type="time"
                value={closureForm.endTime}
                onChange={(e) => setClosureForm(prev => ({ ...prev, endTime: e.target.value }))}
                InputLabelProps={{ shrink: true }}
                fullWidth
              />
            </Box>
          )}
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Reason</InputLabel>
            <Select
              value={closureForm.reason}
              onChange={(e) => setClosureForm(prev => ({ ...prev, reason: e.target.value }))}
              label="Reason"
            >
              <MenuItem value="Staff Training">Staff Training</MenuItem>
              <MenuItem value="Deep Cleaning">Deep Cleaning</MenuItem>
              <MenuItem value="Equipment Maintenance">Equipment Maintenance</MenuItem>
              <MenuItem value="Public Holiday">Public Holiday</MenuItem>
              <MenuItem value="Private Event">Private Event</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
          
          <TextField
            fullWidth
            label="Description (Optional)"
            multiline
            rows={3}
            value={closureForm.description}
            onChange={(e) => setClosureForm(prev => ({ ...prev, description: e.target.value }))}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClosureDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleClosureSubmit} variant="contained" color="error">
            Close Restaurant
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reservation Details Dialog */}
      <Dialog open={reservationDialogOpen} onClose={() => setReservationDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            Reservation Details
            <IconButton onClick={() => setReservationDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedReservation && (
            <Grid container spacing={3}>
              <Grid size={6}>
                <Typography variant="h6" gutterBottom>Customer Information</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Name</Typography>
                  <Typography variant="body1">{selectedReservation.customerName}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Phone</Typography>
                  <Typography variant="body1">{selectedReservation.customerPhone}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Guest Count</Typography>
                  <Typography variant="body1">{selectedReservation.guestCount} guests</Typography>
                </Box>
              </Grid>
              
              <Grid size={6}>
                <Typography variant="h6" gutterBottom>Reservation Details</Typography>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                  <Typography variant="body1">
                    {new Date(selectedReservation.reservationTime).toLocaleString()}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Table</Typography>
                  <Typography variant="body1">
                    {selectedReservation.tableNumber} - {selectedReservation.diningAreaName}
                  </Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Buffet Type</Typography>
                  <Typography variant="body1">{selectedReservation.buffetType}</Typography>
                </Box>
                <Box mb={2}>
                  <Typography variant="body2" color="text.secondary">Status</Typography>
                  <Chip
                    label={selectedReservation.status}
                    color={getStatusColor(selectedReservation.status) as any}
                    size="small"
                  />
                </Box>
              </Grid>
              
              {(selectedReservation.specialRequests || selectedReservation.occasionType || selectedReservation.preferredSeating) && (
                <Grid size={12}>
                  <Typography variant="h6" gutterBottom>Additional Information</Typography>
                  {selectedReservation.occasionType && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Occasion Type</Typography>
                      <Typography variant="body1">{selectedReservation.occasionType}</Typography>
                    </Box>
                  )}
                  {selectedReservation.preferredSeating && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Preferred Seating</Typography>
                      <Typography variant="body1">{selectedReservation.preferredSeating}</Typography>
                    </Box>
                  )}
                  {selectedReservation.specialRequests && (
                    <Box mb={2}>
                      <Typography variant="body2" color="text.secondary">Special Requests</Typography>
                      <Typography variant="body1">{selectedReservation.specialRequests}</Typography>
                    </Box>
                  )}
                </Grid>
              )}
            </Grid>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};