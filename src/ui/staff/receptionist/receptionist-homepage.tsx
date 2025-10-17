import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Chip,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Paper,
  Stack,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import {
  Search as SearchIcon,
  CheckCircle as CheckIcon,
  Cancel as CancelIcon,
  Close as CloseIcon,
  PendingActions as PendingIcon,
} from '@mui/icons-material';
import { ReservationStatus, type Reservation } from '../../../interfaces/reservation';
import { Meal } from '../../../enums/meal';
import { useConfirmation } from '../../../hooks/useConfirmation';

interface ReservationColumn {
  id: 'customer' | 'code' | 'dateTime' | 'area' | 'guests' | 'meal' | 'status' | 'actions';
  label: string;
  minWidth?: number;
  align?: 'right' | 'center';
}

const columns: readonly ReservationColumn[] = [
  { id: 'customer', label: 'Customer', minWidth: 200 },
  { id: 'code', label: 'Code', minWidth: 80 },
  { id: 'dateTime', label: 'Date & Time', minWidth: 150 },
  { id: 'area', label: 'Dining Area', minWidth: 120 },
  { id: 'guests', label: 'Guests', minWidth: 80, align: 'center' },
  { id: 'meal', label: 'Meal', minWidth: 100 },
  { id: 'status', label: 'Status', minWidth: 120, align: 'center' },
  { id: 'actions', label: 'Actions', minWidth: 200, align: 'center' },
];

export const ReceptionistDashboard: React.FC = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [filteredReservations, setFilteredReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationPhone, setVerificationPhone] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const { confirm } = useConfirmation();

  // Mock data - replace with actual API call
  useEffect(() => {
    const mockReservations: Reservation[] = [
      {
        id: 1,
        reservationCode: 'ABC123',
        customerName: 'John Smith',
        customerPhone: '+1234567890',
        meal: Meal.Dinner,
        diningAreaId: 1,
        diningArea: { id: 1, name: 'Main Hall', description: 'Main dining area' },
        noOfSeats: 4,
        reservationDate: '2025-10-18T19:00:00',
        status: ReservationStatus.Pending,
        notes: 'Birthday celebration',
        createdAt: '2025-10-18T14:30:00', // Most recent
      },
      {
        id: 2,
        reservationCode: 'XYZ789',
        customerName: 'Sarah Johnson',
        customerPhone: '+1234567891',
        meal: Meal.Dinner,
        diningAreaId: 2,
        diningArea: { id: 2, name: 'Garden Terrace', description: 'Outdoor seating' },
        noOfSeats: 2,
        reservationDate: '2025-10-18T18:30:00',
        status: ReservationStatus.Completed,
        notes: '',
        createdAt: '2025-10-18T12:15:00',
      },
      {
        id: 3,
        reservationCode: 'DEF456',
        customerName: 'Mike Wilson',
        customerPhone: '+1234567892',
        meal: Meal.Lunch,
        diningAreaId: 1,
        diningArea: { id: 1, name: 'Main Hall', description: 'Main dining area' },
        noOfSeats: 6,
        reservationDate: '2025-10-19T12:00:00',
        status: ReservationStatus.Pending,
        notes: 'Wheelchair accessible table',
        createdAt: '2025-10-18T09:45:00',
      },
      {
        id: 4,
        reservationCode: 'GHI789',
        customerName: 'Emily Davis',
        customerPhone: '+1234567893',
        meal: Meal.Dinner,
        diningAreaId: 3,
        diningArea: { id: 3, name: 'Rooftop Lounge', description: 'Premium rooftop seating' },
        noOfSeats: 3,
        reservationDate: '2025-10-18T20:30:00',
        status: ReservationStatus.Pending,
        notes: '',
        createdAt: '2025-10-18T08:20:00',
      },
      {
        id: 5,
        reservationCode: 'JKL012',
        customerName: 'Robert Brown',
        customerPhone: '+1234567894',
        meal: Meal.Lunch,
        diningAreaId: 1,
        diningArea: { id: 1, name: 'Main Hall', description: 'Main dining area' },
        noOfSeats: 8,
        reservationDate: '2025-10-18T13:15:00',
        status: ReservationStatus.Pending,
        notes: 'Corporate meeting',
        createdAt: '2025-10-17T16:30:00', // Oldest
      },
    ];
    
    setTimeout(() => {
      setReservations(mockReservations);
      setFilteredReservations(mockReservations);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter and sort reservations based on search (sorted by created date descending)
  useEffect(() => {
    let filtered = [...reservations];
    
    // Sort by created date (most recent first)
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(reservation =>
        reservation.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.customerPhone.includes(searchTerm) ||
        reservation.reservationCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reservation.diningArea?.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredReservations(filtered);
    setPage(0); // Reset to first page when filtering
  }, [searchTerm, reservations]);

  const handleVerification = async () => {
    try {
      const reservation = reservations.find(r => 
        r.reservationCode.toLowerCase() === verificationCode.toLowerCase() &&
        r.customerPhone === verificationPhone
      );
      
      if (reservation) {
        updateReservationStatus(reservation.id, ReservationStatus.Completed);
        alert(`✅ Verification successful! Welcome ${reservation.customerName}`);
      } else {
        alert('❌ Invalid verification code or phone number');
      }
      
      setVerificationOpen(false);
      setVerificationCode('');
      setVerificationPhone('');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  };

  const updateReservationStatus = (id: number, status: ReservationStatus) => {
    setReservations(prev => 
      prev.map(reservation => 
        reservation.id === id ? { ...reservation, status } : reservation
      )
    );
  };

  const handleCheckIn = async (reservation: Reservation) => {
    const confirmed = await confirm({
      title: 'Check-In Confirmation',
      message: `Are you sure you want to check in **${reservation.customerName}**?`,
      confirmText: 'Check In',
      cancelText: 'Cancel'
    });
    
    if (confirmed) {
      updateReservationStatus(reservation.id, ReservationStatus.Completed);
    }
  };

  const handleCancel = async (reservation: Reservation) => {
    const confirmed = await confirm({
      title: 'Cancel Reservation',
      message: `Are you sure you want to cancel the reservation for **${reservation.customerName}**?`,
      confirmText: 'Cancel Reservation',
      cancelText: 'Keep Reservation',
      confirmButtonDanger: true
    });
    
    if (confirmed) {
      updateReservationStatus(reservation.id, ReservationStatus.Cancelled);
    }
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const getStatusColor = (status: ReservationStatus) => {
    switch (status) {
      case ReservationStatus.Pending:
        return 'warning';
      case ReservationStatus.Completed:
        return 'success';
      case ReservationStatus.Cancelled:
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    };
  };



  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography>Loading reservations...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Reception Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage customer arrivals and verify reservations
        </Typography>
      </Box>

      {/* Search Bar */}
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search by name, phone, code, or dining area..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: 'background.paper' }}
        />
      </Box>

      {/* Reservations Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="reservations table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{ fontWeight: 'bold', backgroundColor: 'grey.50' }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredReservations
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((reservation) => {
                  const dateTime = formatDateTime(reservation.reservationDate);
                  return (
                    <TableRow 
                      hover 
                      role="checkbox" 
                      tabIndex={-1} 
                      key={reservation.id}
                      sx={{
                        backgroundColor: reservation.status === ReservationStatus.Pending 
                          ? 'warning.50' 
                          : 'inherit',
                        '&:hover': {
                          backgroundColor: reservation.status === ReservationStatus.Pending
                            ? 'warning.100'
                            : 'action.hover'
                        }
                      }}
                    >
                      {/* Customer Info */}
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {reservation.customerName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {reservation.customerPhone}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Reservation Code */}
                      <TableCell>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {reservation.reservationCode}
                        </Typography>
                      </TableCell>

                      {/* Date & Time */}
                      <TableCell>
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                            {dateTime.date}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {dateTime.time}
                          </Typography>
                        </Box>
                      </TableCell>

                      {/* Dining Area */}
                      <TableCell>
                        <Typography variant="body2">
                          {reservation.diningArea?.name || 'N/A'}
                        </Typography>
                      </TableCell>

                      {/* Guests */}
                      <TableCell align="center">
                        <Typography variant="body2">
                          {reservation.noOfSeats}
                        </Typography>
                      </TableCell>

                      {/* Meal */}
                      <TableCell>
                        <Chip 
                          label={reservation.meal} 
                          size="small" 
                          color="secondary"
                          variant="outlined"
                        />
                      </TableCell>

                      {/* Status */}
                      <TableCell align="center">
                        <Chip
                          label={reservation.status}
                          color={getStatusColor(reservation.status) as any}
                          icon={reservation.status === ReservationStatus.Pending ? <PendingIcon /> : <CheckIcon />}
                          size="small"
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell align="center">
                        {reservation.status === ReservationStatus.Pending ? (
                          <Stack direction="row" spacing={1} justifyContent="center">
                            <Button
                              size="small"
                              variant="contained"
                              color="success"
                              startIcon={<CheckIcon />}
                              onClick={() => handleCheckIn(reservation)}
                            >
                              Check In
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              color="error"
                              startIcon={<CancelIcon />}
                              onClick={() => handleCancel(reservation)}
                            >
                              Cancel
                            </Button>
                          </Stack>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            {reservation.status === ReservationStatus.Completed ? 'Checked In' : 'Cancelled'}
                          </Typography>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredReservations.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* No results */}
      {filteredReservations.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: 'center', mt: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No reservations found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms or check if there are any bookings for today
          </Typography>
        </Paper>
      )}

      {/* Verification Dialog */}
      <Dialog open={verificationOpen} onClose={() => setVerificationOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Customer Arrival Verification</Typography>
            <IconButton onClick={() => setVerificationOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TextField
              fullWidth
              label="Verification Code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
              placeholder="e.g., ABC123"
              helperText="Enter the 6-character code from customer's reservation"
            />
            <TextField
              fullWidth
              label="Customer Phone Number"
              value={verificationPhone}
              onChange={(e) => setVerificationPhone(e.target.value)}
              placeholder="e.g., +1234567890"
              helperText="Enter the phone number used for booking"
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setVerificationOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleVerification}
            disabled={!verificationCode || !verificationPhone}
            startIcon={<CheckIcon />}
          >
            Verify & Check-In
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};