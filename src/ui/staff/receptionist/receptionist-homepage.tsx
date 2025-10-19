import {
  Cancel as CancelIcon,
  CheckCircle as CheckIcon,
  PendingActions as PendingIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { useAlert } from "../../../hooks/useAlert";
import { useConfirmation } from "../../../hooks/useConfirmation";
import { ReservationStatus, type Reservation } from "../../../interfaces/reservation";
import { ReceptionistReservationsService } from "../../../services/staff/receptionist/reservations";

interface ReservationColumn {
  id: "customer" | "code" | "dateTime" | "area" | "guests" | "meal" | "status" | "actions";
  label: string;
  minWidth?: number;
  align?: "right" | "center";
}

const columns: readonly ReservationColumn[] = [
  { id: "customer", label: "Customer", minWidth: 200 },
  { id: "code", label: "Code", minWidth: 80 },
  { id: "dateTime", label: "Date & Time", minWidth: 150 },
  { id: "area", label: "Dining Area", minWidth: 120 },
  { id: "guests", label: "Guests", minWidth: 80, align: "center" },
  { id: "meal", label: "Meal", minWidth: 100 },
  { id: "status", label: "Status", minWidth: 120, align: "center" },
  { id: "actions", label: "Actions", minWidth: 200, align: "center" },
];

export const ReceptionistDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { confirm } = useConfirmation();
  const { showSuccess, showError } = useAlert();
  const queryClient = useQueryClient();

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Fetch reservations using React Query with pagination
  const {
    data: paginatedData,
    isLoading: loading,
    error,
    isError,
  } = useQuery({
    queryKey: ["receptionist-reservations", page + 1, rowsPerPage, debouncedSearchTerm], // page + 1 because backend expects 1-based indexing
    queryFn: () =>
      ReceptionistReservationsService.getAll({
        page: page + 1, // Convert 0-based to 1-based
        limit: rowsPerPage,
        customerName: debouncedSearchTerm || undefined,
      }),
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });

  const reservations = paginatedData?.data || [];
  const totalReservations = paginatedData?.pagination?.total || 0;

  // Show error message if API fails
  useEffect(() => {
    if (isError && error) {
      showError("Failed to load reservations. Please refresh the page.");
    }
  }, [isError, error, showError]);

  // Mutation for completing reservations
  const completeReservationMutation = useMutation({
    mutationFn: (reservationId: number) =>
      ReceptionistReservationsService.completeReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receptionist-reservations"] });
      showSuccess("Reservation checked in successfully!");
    },
    onError: (error) => {
      console.error("Failed to complete reservation:", error);
      showError("Failed to check in reservation. Please try again.");
    },
  });

  // Mutation for cancelling reservations
  const cancelReservationMutation = useMutation({
    mutationFn: (reservationId: number) =>
      ReceptionistReservationsService.cancelReservation(reservationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["receptionist-reservations"] });
      showSuccess("Reservation cancelled successfully!");
    },
    onError: (error) => {
      console.error("Failed to cancel reservation:", error);
      showError("Failed to cancel reservation. Please try again.");
    },
  });

  // Reset to first page when search term changes
  useEffect(() => {
    setPage(0);
  }, [debouncedSearchTerm]);

  const handleCheckIn = async (reservation: Reservation) => {
    const confirmed = await confirm({
      title: "Check-In Confirmation",
      message: `Are you sure you want to check in **${reservation.customerName}**?`,
      confirmText: "Check In",
      cancelText: "Cancel",
    });

    if (confirmed) {
      try {
        await completeReservationMutation.mutateAsync(reservation.id);
      } catch (error) {
        // Error is already handled in the mutation's onError callback
        console.error("Check-in failed:", error);
      }
    }
  };

  const handleCancel = async (reservation: Reservation) => {
    const confirmed = await confirm({
      title: "Cancel Reservation",
      message: `Are you sure you want to cancel the reservation for **${reservation.customerName}**?`,
      confirmText: "Cancel Reservation",
      cancelText: "Keep Reservation",
      confirmButtonDanger: true,
    });

    if (confirmed) {
      try {
        await cancelReservationMutation.mutateAsync(reservation.id);
      } catch (error) {
        // Error is already handled in the mutation's onError callback
        console.error("Cancel failed:", error);
      }
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
        return "warning";
      case ReservationStatus.Completed:
        return "success";
      case ReservationStatus.Cancelled:
        return "error";
      default:
        return "default";
    }
  };

  const formatDateTime = (dateStr: string | Date) => {
    const date = new Date(dateStr);
    return {
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      time: date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
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
        <Box sx={{ mb: 2 }}>
          <Typography variant="h4" gutterBottom>
            Reception Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage customer arrivals and verify reservations
          </Typography>
        </Box>
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
          sx={{ backgroundColor: "background.paper" }}
        />
      </Box>

      {/* Reservations Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="reservations table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}
                    sx={{ fontWeight: "bold", backgroundColor: "grey.50" }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {reservations.map((reservation) => {
                const dateTime = formatDateTime(reservation.reservationDate);
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={reservation.id}
                    sx={{
                      backgroundColor:
                        reservation.status === ReservationStatus.Pending ? "warning.50" : "inherit",
                      "&:hover": {
                        backgroundColor:
                          reservation.status === ReservationStatus.Pending
                            ? "warning.100"
                            : "action.hover",
                      },
                    }}
                  >
                    {/* Customer Info */}
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                          {reservation.customerName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {reservation.customerPhone}
                        </Typography>
                      </Box>
                    </TableCell>

                    {/* Reservation Code */}
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "monospace", fontWeight: "bold" }}
                      >
                        {reservation.reservationCode}
                      </Typography>
                    </TableCell>

                    {/* Date & Time */}
                    <TableCell>
                      <Box>
                        <Typography variant="body2" sx={{ fontWeight: "medium" }}>
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
                        {reservation.diningArea?.name || "N/A"}
                      </Typography>
                    </TableCell>

                    {/* Guests */}
                    <TableCell align="center">
                      <Typography variant="body2">{reservation.noOfSeats}</Typography>
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
                        icon={
                          reservation.status === ReservationStatus.Pending ? (
                            <PendingIcon />
                          ) : (
                            <CheckIcon />
                          )
                        }
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
                            disabled={completeReservationMutation.isPending}
                          >
                            {completeReservationMutation.isPending ? "Checking In..." : "Check In"}
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<CancelIcon />}
                            onClick={() => handleCancel(reservation)}
                            disabled={cancelReservationMutation.isPending}
                          >
                            {cancelReservationMutation.isPending ? "Cancelling..." : "Cancel"}
                          </Button>
                        </Stack>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          {reservation.status === ReservationStatus.Completed
                            ? "Checked In"
                            : "Cancelled"}
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
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={totalReservations}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* No results */}
      {reservations.length === 0 && !loading && (
        <Paper sx={{ p: 4, textAlign: "center", mt: 2 }}>
          <Typography variant="h6" color="text.secondary">
            No reservations found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Try adjusting your search terms or check if there are any bookings for today
          </Typography>
        </Paper>
      )}
    </Box>
  );
};
