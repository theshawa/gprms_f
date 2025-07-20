import { getBackendErrorMessage } from "@/backend";
import { getNameForRole } from "@/enums/staff-role";
import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import type { StaffUser } from "@/interfaces/staff-user";
import { StaffService } from "@/services/staff";
import { Button, Stack, TableCell, TableRow, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SetStateAction } from "jotai";
import { type Dispatch, type FC, useState } from "react";
import { QKs } from "../../query-keys";
import { ActivityHistoryDialog } from "./activity-history-dialog";
import { ManageAccountDialog } from "./manage-account-dialog";

export const AccountRow: FC<{
  account: StaffUser;
  setRoleFilter: Dispatch<SetStateAction<string[]>>;
}> = ({ account, setRoleFilter }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activityHistoryDialogOpen, setActivityHistoryDialogOpen] =
    useState(false);

  const { auth } = useStaffAuth();
  const { confirm } = useConfirmation();

  const queryClient = useQueryClient();

  const { showError, showSuccess } = useAlert();

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: () => StaffService.deleteStaffAccount(account.id),
    mutationKey: ["admin_manageStaff_deleteAccount"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QKs.admin_staff });
      showSuccess("Staff account deleted successfully.");
    },
    onError: (err) => {
      showError(
        `Failed to delete staff account: ${getBackendErrorMessage(err)}`
      );
    },
  });

  return (
    <>
      <TableRow>
        <TableCell>
          <Button onClick={() => setRoleFilter([account.role])}>
            {getNameForRole(account.role)}
          </Button>
        </TableCell>
        <TableCell>
          <Typography fontFamily="monospace" variant="body1">
            {account.username}
          </Typography>
        </TableCell>
        <TableCell>
          {account.name} {account.id === auth?.user.id && <>(You)</>}
        </TableCell>
        <TableCell align="right">
          {account.id !== auth?.user.id ? (
            <Stack direction="row" justifyContent="end" spacing={0.5}>
              <Button
                onClick={() => setActivityHistoryDialogOpen(true)}
                disabled={isDeleting}
                sx={{ flexShrink: 0 }}
              >
                Activity History
              </Button>
              <Button
                onClick={() => setEditDialogOpen(true)}
                disabled={isDeleting}
              >
                Edit
              </Button>
              <Button
                color="error"
                onClick={async () => {
                  if (
                    await confirm({
                      title: "Are you sure?",
                      message: `You are going to delete the account of ${account.name}? All associated data related to this account will be lost. This action cannot be undone.`,
                      confirmText: " Delete Account",
                      confirmButtonDanger: true,
                    })
                  ) {
                    deleteAccount();
                  }
                }}
                disabled={isDeleting}
              >
                Delete
              </Button>
            </Stack>
          ) : (
            <Button color="info" disabled size="small">
              No actions available for your own account.
            </Button>
          )}
        </TableCell>
      </TableRow>
      <ManageAccountDialog
        editingAccount={account}
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
      />
      <ActivityHistoryDialog
        open={activityHistoryDialogOpen}
        handleClose={() => setActivityHistoryDialogOpen(false)}
        account={account}
      />
    </>
  );
};
