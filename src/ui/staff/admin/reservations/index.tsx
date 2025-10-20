import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
  Chip,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { FC } from "react";
import { ReservationsService } from "@/services/staff/admin/reservations";
import { PageLayout } from "../../shared/page-layout";
import { getNameForMeal } from "@/enums/meal";
import { ReservationStatus } from "@/interfaces/reservation";

export const Admin_ReservationsPage: FC = () => {
  const {
    data: reservations,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin", "reservations"],
    queryFn: () => ReservationsService.getAll(),
  });

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

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <PageLayout
      title="Reservations"
      subtitle="View all reservations in the system"
    >
      <Box sx={{ p: 3 }}>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Reservation Code
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Customer Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Phone Number
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Dining Area
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Meal
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Seats
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Reservation Date
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Status
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
                    <TableCell colSpan={9} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Alert severity="error">
                        Failed to load reservations. Please try again.
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : reservations && reservations.length > 0 ? (
                  reservations.map((reservation) => (
                    <TableRow
                      key={reservation.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>
                        <Typography variant="body2" fontWeight="medium">
                          {reservation.reservationCode}
                        </Typography>
                      </TableCell>
                      <TableCell>{reservation.customerName}</TableCell>
                      <TableCell>{reservation.customerPhone}</TableCell>
                      <TableCell>
                        {reservation.diningArea?.name || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getNameForMeal(reservation.meal)}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell>{reservation.noOfSeats}</TableCell>
                      <TableCell>
                        {formatDate(reservation.reservationDate)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={reservation.status}
                          size="small"
                          color={getStatusColor(reservation.status)}
                        />
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
                          {reservation.notes || "-"}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No reservations found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </PageLayout>
  );
};
