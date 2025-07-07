import { type FC, useState } from "react";

import { PersonAdd } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
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
import { getBackendErrorMessage } from "../../../../../backend";
import { getNameForRole } from "../../../../../enums/staff-role";
import { useAlert } from "../../../../../hooks/useAlert";
import { useConfirmation } from "../../../../../hooks/useConfirmation";
import { useStaffAuth } from "../../../../../hooks/useStaffAuth";
import type { StaffUser } from "../../../../../interfaces/staff-user";
import { StaffService } from "../../../../../services/staff";
import { PageLoader } from "../../../shared/page-loader";
import { ManageAccountDialog } from "./manage-account-dialog";

export const Admin_ManageStaff_HomePage: FC = () => {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["admin_manageStaff_home"],
    queryFn: () => StaffService.getStaffAccounts(),
  });

  const { auth } = useStaffAuth();

  const [manageAccountDialogOpen, setManageAccountDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<StaffUser>();

  const { confirm } = useConfirmation();
  const { showError, showSuccess } = useAlert();

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Failed to load staff accounts: {getBackendErrorMessage(error)}
        </Alert>
      </Box>
    );
  }

  const closeDialog = () => {
    setManageAccountDialogOpen(false);
    setTimeout(() => {
      setEditingAccount(undefined);
    }, 600);
  };

  const deleteAccount = async (id: number) => {
    const ok = await confirm({
      title: "Delete Staff Account",
      message: "Are you sure you want to delete this staff account?",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
    if (!ok) return;

    try {
      await StaffService.deleteStaffAccount(id);
      refetch();
      showSuccess("Staff account deleted successfully.");
    } catch (error) {
      showError(
        `Failed to delete staff account: ${getBackendErrorMessage(error)}`
      );
    }
  };

  return (
    <>
      <Box p={3}>
        <Box
          display="flex"
          justifyContent="space-between"
          flexDirection={{ xs: "column", sm: "row" }}
          alignItems="start"
          mb={3}
        >
          <Box mb={{ xs: 2, sm: 0 }}>
            <Typography variant="h5">Staff Accounts</Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Manage Staff Accounts
            </Typography>
          </Box>
          <Button
            onClick={() => setManageAccountDialogOpen(true)}
            variant="contained"
            color="primary"
            startIcon={<PersonAdd />}
          >
            Add New Staff
          </Button>
        </Box>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1000 }} aria-label="staff accounts table">
            <TableHead>
              <TableRow>
                <TableCell width="20%">Role</TableCell>
                <TableCell width="20%">Username</TableCell>
                <TableCell width="30%">Name</TableCell>
                <TableCell width="30%" align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((m) => (
                <TableRow key={m.id}>
                  <TableCell>{getNameForRole(m.role)}</TableCell>
                  <TableCell>{m.username}</TableCell>
                  <TableCell>
                    {m.name} {m.id === auth?.user.id && <>(You)</>}
                  </TableCell>
                  <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                    {m.id !== auth?.user.id ? (
                      <>
                        <Button
                          color="error"
                          onClick={() => deleteAccount(m.id)}
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => {
                            setEditingAccount(m);
                            setManageAccountDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button>Activity History</Button>
                      </>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No actions available
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      <ManageAccountDialog
        currentAccount={editingAccount}
        open={manageAccountDialogOpen}
        handleClose={closeDialog}
        onManageSuccess={() => {
          refetch();
          closeDialog();
        }}
      />
    </>
  );
};
