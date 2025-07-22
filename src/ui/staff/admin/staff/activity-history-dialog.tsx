import { getBackendErrorMessage } from "@/backend";
import { getNameForRole } from "@/enums/staff-role";
import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import type { StaffUser } from "@/interfaces/staff-user";
import { StaffService } from "@/services/staff/staff";
import { formatDateTime } from "@/utils/time-format";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { type FC, useState } from "react";

export const ActivityHistoryDialog: FC<{
  open: boolean;
  account: StaffUser;
  handleClose: () => void;
}> = ({ handleClose, open, account }) => {
  const [activitiesPerPage, setActivitiesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isPending, error } = useQuery({
    queryKey: [
      "staff_activity_history",
      account.id,
      currentPage,
      activitiesPerPage,
    ],
    queryFn: async () =>
      StaffService.getStaffActivityHistory(
        account.id,
        currentPage,
        activitiesPerPage
      ),
    enabled: open,
    refetchOnWindowFocus: false,
  });

  const { confirm } = useConfirmation();
  const { showError, showSuccess } = useAlert();

  const { mutate: clearHistory, isPending: isClearingHistory } = useMutation({
    mutationFn: () => StaffService.clearStaffActivityHistory(account.id),
    onSuccess: () => {
      showSuccess("Activity history cleared successfully.");
      close();
    },
    onError: (err) => {
      showError(
        "Failed to clear activity history: " + getBackendErrorMessage(err)
      );
    },
  });

  const close = () => {
    setCurrentPage(1);
    setActivitiesPerPage(10);
    handleClose();
  };

  return (
    <Dialog open={open} maxWidth="xl">
      <DialogTitle>
        Activity History of {account.name} ({getNameForRole(account.role)})
      </DialogTitle>
      <DialogContent>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 600 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell width="30%">Time</TableCell>
                <TableCell>Activity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isPending ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <LinearProgress />
                  </TableCell>
                </TableRow>
              ) : error ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    <Alert severity="error">
                      Failed to load activity history:{" "}
                      {getBackendErrorMessage(error)}
                    </Alert>
                  </TableCell>
                </TableRow>
              ) : (
                <>
                  {data.activities.map((activity) => (
                    <TableRow key={activity.id}>
                      <TableCell>
                        {formatDateTime(activity.createdAt)}
                      </TableCell>
                      <TableCell>{activity.activity}</TableCell>
                    </TableRow>
                  ))}
                  {data.activities.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={2} align="center">
                        <Typography variant="body1" color="textSecondary">
                          No activity history found.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={2}
                  disabled={isPending || data?.totalCount === 0}
                  rowsPerPageOptions={
                    (data?.totalCount ?? 0) > 10 ? [10, 20] : [10]
                  }
                  count={data?.totalCount ?? -1}
                  onPageChange={(_, p) => setCurrentPage(p + 1)}
                  page={currentPage - 1}
                  onRowsPerPageChange={(e) => {
                    setActivitiesPerPage(parseInt(e.target.value, 10));
                    setCurrentPage(1);
                  }}
                  rowsPerPage={activitiesPerPage}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} disabled={isClearingHistory}>
          Close
        </Button>
        <Button
          onClick={async () => {
            if (
              await confirm({
                title: "Are you sure?",
                message: `You are going to clear the activity history of ${account.name}? This action cannot be undone.`,
                confirmText: "Yes, Clear History",
                confirmButtonDanger: true,
              })
            ) {
              clearHistory();
            }
          }}
          disabled={
            data?.activities.length === 0 || isPending || isClearingHistory
          }
          color="error"
        >
          Clear
        </Button>
      </DialogActions>
    </Dialog>
  );
};
