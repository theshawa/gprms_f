import { type FC, useRef, useState } from "react";

import { getBackendErrorMessage } from "@/backend";
import { getNameForRole } from "@/enums/staff-role";
import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import type { StaffUser } from "@/interfaces/staff-user";
import { StaffService } from "@/services/staff";
import { PageError } from "@/ui/staff/shared/page-error";
import { PageLoader } from "@/ui/staff/shared/page-loader";
import { PersonAdd } from "@mui/icons-material";
import {
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { ItemsPageLayout } from "../../shared/items-page-layout";
import { ActivityHistoryDialog } from "./activity-history-dialog";
import { ManageAccountDialog } from "./manage-account-dialog";

export const Admin_ManageStaffPage: FC = () => {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["admin_manageStaff_home"],
    queryFn: () => StaffService.getStaffAccounts(),
  });

  const { auth } = useStaffAuth();

  const [manageAccountDialogOpen, setManageAccountDialogOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<StaffUser>();
  const [activityHistoryDialogOpen, setActivityHistoryDialogOpen] =
    useState(false);
  const [activityHistoryAccount, setActivityHistoryAccount] =
    useState<StaffUser>();

  const timeOutRef = useRef<number>(null);

  const { confirm } = useConfirmation();
  const { showError, showSuccess } = useAlert();

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => StaffService.deleteStaffAccount(id),
    mutationKey: ["admin_manageStaff_deleteAccount"],
    onSuccess: () => {
      refetch();
      showSuccess("Staff account deleted successfully.");
    },
    onError: (err) => {
      showError(
        `Failed to delete staff account: ${getBackendErrorMessage(err)}`
      );
    },
  });

  const closeManageAccountDialog = () => {
    setManageAccountDialogOpen(false);
    timeOutRef.current = setTimeout(() => {
      setEditingAccount(undefined);
    }, 300);
  };

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError error={error} />;
  }

  return (
    <>
      <ItemsPageLayout
        title="Staff Accounts"
        subtitle="It's your restaurant's team members. You can add new staff and manage existing accounts."
        buttonText="New Staff Account"
        buttonIcon={<PersonAdd />}
        onButtonClick={() => setManageAccountDialogOpen(true)}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1000 }} aria-label="staff accounts table">
            <TableHead>
              <TableRow>
                <TableCell width="20%">Role & Permissions</TableCell>
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
                  <TableCell>
                    <Typography fontFamily="monospace" variant="body1">
                      {m.username}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {m.name} {m.id === auth?.user.id && <>(You)</>}
                  </TableCell>
                  <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
                    {m.id !== auth?.user.id ? (
                      <>
                        <Button
                          color="error"
                          onClick={async () => {
                            if (
                              await confirm({
                                title: "Are you sure?",
                                message: `You are going to delete the account of ${m.name}? All associated data related to this account will be lost. This action cannot be undone.`,
                                confirmText: " Delete Account",
                                confirmButtonDanger: true,
                              })
                            ) {
                              deleteAccount(m.id);
                            }
                          }}
                          disabled={isDeleting}
                        >
                          Delete
                        </Button>
                        <Button
                          onClick={() => {
                            if (timeOutRef.current) {
                              clearTimeout(timeOutRef.current);
                            }
                            setEditingAccount(m);
                            setManageAccountDialogOpen(true);
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => {
                            if (timeOutRef.current) {
                              clearTimeout(timeOutRef.current);
                            }
                            setActivityHistoryAccount(m);
                            setActivityHistoryDialogOpen(true);
                          }}
                        >
                          Activity History
                        </Button>
                      </>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No actions available for your own account.
                      </Typography>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ItemsPageLayout>
      <ManageAccountDialog
        currentAccount={editingAccount}
        open={manageAccountDialogOpen}
        handleClose={closeManageAccountDialog}
        onManageSuccess={() => {
          refetch();
          closeManageAccountDialog();
        }}
      />
      <ActivityHistoryDialog
        open={activityHistoryDialogOpen}
        handleClose={() => {
          setActivityHistoryDialogOpen(false);
          timeOutRef.current = setTimeout(() => {
            setActivityHistoryAccount(undefined);
          }, 300);
        }}
        account={activityHistoryAccount}
      />
    </>
  );
};
