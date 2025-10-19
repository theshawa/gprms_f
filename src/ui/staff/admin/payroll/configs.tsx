import { useAlert } from "@/hooks/useAlert";
import type { StaffPayrollConfig } from "@/interfaces/staff-payroll-config";
import { PayrollService } from "@/services/staff/admin/payroll";
import { ArrowBack, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QKs } from "../../query-keys";
import { PageError } from "../../shared/page-error";
import { PageLayout } from "../../shared/page-layout";
import { PageLoader } from "../../shared/page-loader";

export const Admin_PayrollConfigsPage: FC = () => {
  const { showSuccess, showError } = useAlert();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedConfig, setSelectedConfig] =
    useState<StaffPayrollConfig | null>(null);
  const [formData, setFormData] = useState({
    basicSalary: 0,
    transportAllowance: 0,
    mealAllowance: 0,
    otherAllowance: 0,
    taxPercentage: 0,
    epfPercentage: 8,
  });

  const { isPending, error, data } = useQuery({
    queryKey: QKs.admin_payroll_configs,
    queryFn: () => PayrollService.getAllStaffConfigs(),
  });

  const updateMutation = useMutation({
    mutationFn: (data: { staffId: number; config: typeof formData }) =>
      PayrollService.updateStaffConfig(data.staffId, data.config),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QKs.admin_payroll_configs });
      setEditDialogOpen(false);
      showSuccess("Staff salary configuration updated successfully");
    },
    onError: (error: any) => {
      showError(
        error.response?.data?.message || "Failed to update configuration"
      );
    },
  });

  const handleEdit = (config: StaffPayrollConfig) => {
    setSelectedConfig(config);
    setFormData({
      basicSalary: config.basicSalary,
      transportAllowance: config.transportAllowance,
      mealAllowance: config.mealAllowance,
      otherAllowance: config.otherAllowance,
      taxPercentage: config.taxPercentage,
      epfPercentage: config.epfPercentage,
    });
    setEditDialogOpen(true);
  };

  const handleSave = () => {
    if (selectedConfig) {
      updateMutation.mutate({
        staffId: selectedConfig.staffMemberId,
        config: formData,
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return `LKR ${amount.toLocaleString("en-LK", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="staff payroll configurations" error={error} />;
  }

  return (
    <>
      <PageLayout
        title="Staff Payroll Configurations"
        subtitle="Manage salary configurations for all staff members."
        actions={
          <Tooltip title="Back to Payroll">
            <IconButton
              onClick={() => navigate("/staff/admin/payroll")}
              color="primary"
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
        }
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell>Staff Member</TableCell>
                <TableCell>Role</TableCell>
                <TableCell align="right">Basic Salary</TableCell>
                <TableCell align="right">Transport</TableCell>
                <TableCell align="right">Meal</TableCell>
                <TableCell align="right">Other</TableCell>
                <TableCell align="right">Tax %</TableCell>
                <TableCell align="right">EPF %</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ py: 4 }}
                    >
                      No staff configurations found.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((config: StaffPayrollConfig) => (
                  <TableRow key={config.id} hover>
                    <TableCell>{config.staffMember?.name || "N/A"}</TableCell>
                    <TableCell>{config.staffMember?.role || "N/A"}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(config.basicSalary)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(config.transportAllowance)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(config.mealAllowance)}
                    </TableCell>
                    <TableCell align="right">
                      {formatCurrency(config.otherAllowance)}
                    </TableCell>
                    <TableCell align="right">{config.taxPercentage}%</TableCell>
                    <TableCell align="right">{config.epfPercentage}%</TableCell>
                    <TableCell align="right">
                      <Button
                        size="small"
                        startIcon={<Edit />}
                        onClick={() => handleEdit(config)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </PageLayout>

      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Salary Configuration</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Staff: {selectedConfig?.staffMember?.name} (
              {selectedConfig?.staffMember?.role})
            </Typography>
            <TextField
              label="Basic Salary (LKR)"
              type="number"
              fullWidth
              value={formData.basicSalary}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  basicSalary: parseFloat(e.target.value) || 0,
                })
              }
            />
            <TextField
              label="Transport Allowance (LKR)"
              type="number"
              fullWidth
              value={formData.transportAllowance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  transportAllowance: parseFloat(e.target.value) || 0,
                })
              }
            />
            <TextField
              label="Meal Allowance (LKR)"
              type="number"
              fullWidth
              value={formData.mealAllowance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  mealAllowance: parseFloat(e.target.value) || 0,
                })
              }
            />
            <TextField
              label="Other Allowance (LKR)"
              type="number"
              fullWidth
              value={formData.otherAllowance}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  otherAllowance: parseFloat(e.target.value) || 0,
                })
              }
            />
            <TextField
              label="Tax Percentage (%)"
              type="number"
              fullWidth
              value={formData.taxPercentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  taxPercentage: parseFloat(e.target.value),
                })
              }
            />
            <TextField
              label="EPF Percentage (%)"
              type="number"
              fullWidth
              value={formData.epfPercentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  epfPercentage: parseFloat(e.target.value),
                })
              }
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSave}
            variant="contained"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
