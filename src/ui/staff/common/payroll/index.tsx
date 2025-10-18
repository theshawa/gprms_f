import { StaffPayrollService } from "@/services/staff/common/payroll";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { type FC } from "react";
import { QKs } from "../../query-keys";
import { PageError } from "../../shared/page-error";
import { PageLayout } from "../../shared/page-layout";
import { PageLoader } from "../../shared/page-loader";

export const Staff_PayrollPage: FC = () => {
  const { isPending: configLoading, data: configData } = useQuery({
    queryKey: QKs.staff_payroll_config,
    queryFn: () => StaffPayrollService.getMyConfig(),
  });

  const {
    isPending: historyLoading,
    error,
    data: historyData,
  } = useQuery({
    queryKey: QKs.staff_payroll_history,
    queryFn: () => StaffPayrollService.getMyPayrollHistory(),
  });

  const formatCurrency = (amount: number) => {
    return `LKR ${amount.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  const formatPeriod = (month: number, year: number) => {
    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    return `${monthNames[month - 1]} ${year}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft":
        return "default";
      case "Processed":
        return "info";
      case "Approved":
        return "success";
      case "Paid":
        return "success";
      default:
        return "default";
    }
  };

  if (configLoading || historyLoading) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="payroll history" error={error} />;
  }

  return (
    <PageLayout
      title="My Payroll"
      subtitle="View your salary configuration and payroll history."
    >
      {configData && (
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Salary Configuration
          </Typography>
          <Card>
            <CardContent>
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 2,
                }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Basic Salary
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(configData.basicSalary)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Transport Allowance
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(configData.transportAllowance)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Meal Allowance
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(configData.mealAllowance)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Other Allowance
                  </Typography>
                  <Typography variant="body1">
                    {formatCurrency(configData.otherAllowance)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Tax Percentage
                  </Typography>
                  <Typography variant="body1">
                    {configData.taxPercentage}%
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    EPF Percentage
                  </Typography>
                  <Typography variant="body1">
                    {configData.epfPercentage}%
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}

      <Typography variant="h6" sx={{ mb: 2 }}>
        Payroll History
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        💰 You will see your monthly payments here after admin marks them as
        paid
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow>
              <TableCell>Period</TableCell>
              <TableCell align="right">Gross Pay</TableCell>
              <TableCell align="right">Deductions</TableCell>
              <TableCell align="right">Net Pay</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Paid Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {historyData?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ py: 4 }}
                  >
                    No payroll records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              historyData?.map((record: any) => (
                <TableRow key={record.id} hover>
                  <TableCell>
                    {formatPeriod(record.month, record.year)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(record.grossPay)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(record.totalDeductions)}
                  </TableCell>
                  <TableCell align="right">
                    {formatCurrency(record.netPay)}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={record.status}
                      color={getStatusColor(record.status) as any}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {record.paidAt
                      ? new Date(record.paidAt).toLocaleDateString("en-US")
                      : "-"}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </PageLayout>
  );
};
