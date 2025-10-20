import { CustomersService } from "@/services/staff/admin/customers";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Rating,
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
import { PageLayout } from "../../shared/page-layout";

export const Admin_CustomerPage: FC = () => {
  const {
    data: customers,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["admin", "customers"],
    queryFn: () => CustomersService.getAll(),
  });

  return (
    <PageLayout
      title="Customers"
      subtitle="View all registered customers in the system"
    >
      <Box sx={{ p: 3 }}>
        <Paper sx={{ width: "100%", overflow: "hidden" }}>
          <TableContainer sx={{ maxHeight: 600 }}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Customer Name
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Telephone Number
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="subtitle2" fontWeight="bold">
                      Rating
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 8 }}>
                      <CircularProgress />
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={3}>
                      <Alert severity="error">
                        Failed to load customers. Please try again.
                      </Alert>
                    </TableCell>
                  </TableRow>
                ) : customers && customers.length > 0 ? (
                  customers.map((customer) => (
                    <TableRow
                      key={customer.id}
                      hover
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell>{customer.name}</TableCell>
                      <TableCell>{customer.phoneNumber}</TableCell>
                      <TableCell>
                        <Rating value={0} readOnly size="small" />
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ ml: 1 }}
                        >
                          (Not yet implemented)
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        No customers found
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
