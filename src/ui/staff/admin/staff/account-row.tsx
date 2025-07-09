import { getBackendErrorMessage } from "@/backend";
import { getNameForRole } from "@/enums/staff-role";
import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import type { StaffUser } from "@/interfaces/staff-user";
import { StaffService } from "@/services/staff";
import { Button, TableCell, TableRow, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { ActivityHistoryDialog } from "./activity-history-dialog";
import { ManageAccountDialog } from "./manage-account-dialog";

export const AccountRow: FC<{ account: StaffUser; onDelete: () => void }> = ({
  account: initialAccount,
  onDelete,
}) => {
  const [account, setAccount] = useState<StaffUser>(initialAccount);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [activityHistoryDialogOpen, setActivityHistoryDialogOpen] =
    useState(false);
  const { auth } = useStaffAuth();
  const { confirm } = useConfirmation();

  const { showError, showSuccess } = useAlert();

  const { mutate: deleteAccount, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => StaffService.deleteStaffAccount(id),
    mutationKey: ["admin_manageStaff_deleteAccount"],
    onSuccess: () => {
      onDelete();
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
        <TableCell>{getNameForRole(account.role)}</TableCell>
        <TableCell>
          <Typography fontFamily="monospace" variant="body1">
            {account.username}
          </Typography>
        </TableCell>
        <TableCell>
          {account.name} {account.id === auth?.user.id && <>(You)</>}
        </TableCell>
        <TableCell align="right" sx={{ display: "flex", gap: 1 }}>
          {account.id !== auth?.user.id ? (
            <>
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
                    deleteAccount(account.id);
                  }
                }}
                disabled={isDeleting}
              >
                Delete
              </Button>
              <Button
                onClick={() => setEditDialogOpen(true)}
                disabled={isDeleting}
              >
                Edit
              </Button>
              <Button
                onClick={() => setActivityHistoryDialogOpen(true)}
                disabled={isDeleting}
              >
                Activity History
              </Button>
            </>
          ) : (
            <Button color="info" disabled>
              No actions available for your own account.
            </Button>
          )}
        </TableCell>
      </TableRow>
      <ManageAccountDialog
        editingAccount={account}
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        onManageSuccess={(v) => setAccount((pa) => ({ ...pa, ...v }))}
      />
      <ActivityHistoryDialog
        open={activityHistoryDialogOpen}
        handleClose={() => setActivityHistoryDialogOpen(false)}
        account={account}
      />
    </>
  );
};
