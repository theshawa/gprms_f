import { getBackendErrorMessage } from "@/backend";
import { StaffRole } from "@/enums/staff-role";
import { useAlert } from "@/hooks/useAlert";
import type { DiningArea } from "@/interfaces/dining-area";
import type { StaffUser } from "@/interfaces/staff-user";
import type { WaiterAssignment } from "@/interfaces/waiter-assignment";
import { DiningAreasService } from "@/services/staff/dining-areas";
import { StaffService } from "@/services/staff/staff";
import { Add, Close, Person, Remove, Search } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type FC, useEffect, useState } from "react";
import { QKs } from "../../query-keys";

interface AssignableWaiter extends StaffUser {
  assigned: boolean;
}

export const AssignWaitersDialog: FC<{
  open: boolean;
  handleClose: () => void;
  diningArea: DiningArea;
}> = ({ open, handleClose, diningArea }) => {
  const { data, isPending, error } = useQuery({
    queryKey: ["assign_waiters_dialog", diningArea.id],
    queryFn: async () => {
      const allWaiters = await StaffService.getStaffAccounts(StaffRole.Waiter);
      const assignedWaiters = await DiningAreasService.getAssignedWaiters(
        diningArea.id
      );
      return { allWaiters, assignedWaiters };
    },
    enabled: open,
  });

  const queryClient = useQueryClient();

  const [waiters, setWaiters] = useState<AssignableWaiter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (!data) {
      return;
    }

    let allWaiters = data.allWaiters.map((w) => ({
      ...w,
      assigned: data.assignedWaiters.some((aw) => aw.id === w.id),
    }));
    if (searchTerm.trim()) {
      const lowerSearchTerm = searchTerm.trim().toLowerCase();
      allWaiters = allWaiters.filter(
        (waiter) =>
          waiter.name.toLowerCase().includes(lowerSearchTerm) ||
          waiter.username.toLowerCase().includes(lowerSearchTerm)
      );
    }
    setWaiters(allWaiters);
  }, [data, searchTerm]);

  const { showError, showSuccess } = useAlert();

  const { mutate: assignWaiterMutation, isPending: assigningWaiter } =
    useMutation<WaiterAssignment, AxiosError, number>({
      mutationFn: (waiterId: number) =>
        DiningAreasService.assignWaiter(diningArea.id, waiterId),
      onSuccess: (assignment) => {
        showSuccess("Waiter assigned successfully.");

        setWaiters((prev) =>
          prev.map((w) =>
            w.id === assignment.waiterId ? { ...w, assigned: true } : w
          )
        );

        queryClient.invalidateQueries({ queryKey: QKs.admin_diningAreas });

        const completeAssignment = { ...assignment, diningArea };
        setWaiters((prev) =>
          prev.map((w) => {
            if (w.id === assignment.waiterId) {
              return {
                ...w,
                assignedDiningAreas: w.assignedDiningAreas
                  ? [...w.assignedDiningAreas, completeAssignment]
                  : [completeAssignment],
              };
            }
            return w;
          })
        );
      },
      onError: (err) => {
        showError("Failed to assign waiter: " + getBackendErrorMessage(err));
      },
    });

  const { mutate: unAssignWaiterMutation, isPending: unAssigningWaiter } =
    useMutation<WaiterAssignment, AxiosError, number>({
      mutationFn: (waiterId: number) =>
        DiningAreasService.unAssignWaiter(diningArea.id, waiterId),
      onSuccess: ({ waiterId }) => {
        showSuccess("Waiter unassigned successfully.");
        setWaiters((prev) =>
          prev.map((w) => (w.id === waiterId ? { ...w, assigned: false } : w))
        );

        queryClient.invalidateQueries({ queryKey: QKs.admin_diningAreas });

        setWaiters((prev) =>
          prev.map((w) => {
            if (w.id === waiterId) {
              return {
                ...w,
                assignedDiningAreas: w.assignedDiningAreas?.filter(
                  (area) => area.diningArea.id !== diningArea.id
                ),
              };
            }
            return w;
          })
        );
      },
      onError: (err) => {
        showError("Failed to unassign waiter: " + getBackendErrorMessage(err));
      },
    });

  return (
    <Dialog open={open} maxWidth="sm" fullWidth>
      <DialogTitle>
        Assign Waiters to Area <q>{diningArea.name}</q>
      </DialogTitle>
      <DialogContent>
        {isPending ? (
          <LinearProgress />
        ) : error ? (
          <Alert severity="error">
            Failed to load waiters: {error.message}
          </Alert>
        ) : !data.allWaiters.length ? (
          <Alert severity="info">
            No waiters found to assign. Create some first.
          </Alert>
        ) : (
          <List disablePadding>
            <ListSubheader>
              <Stack pb={2}>
                {waiters.length > 0 && (
                  <TextField
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                    }}
                    size="small"
                    prefix="as"
                    placeholder="Search..."
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Search />
                          </InputAdornment>
                        ),
                        endAdornment: searchTerm && (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setSearchTerm("")}
                              disableRipple
                            >
                              <Close fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                )}
              </Stack>
            </ListSubheader>

            {waiters.map((waiter) => (
              <ListItem
                key={waiter.id}
                secondaryAction={
                  <IconButton
                    onClick={() =>
                      waiter.assigned
                        ? unAssignWaiterMutation(waiter.id)
                        : assignWaiterMutation(waiter.id)
                    }
                    color={waiter.assigned ? "error" : "primary"}
                    edge="end"
                  >
                    {waiter.assigned ? <Remove /> : <Add />}
                  </IconButton>
                }
              >
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText>
                  <Stack>
                    <Typography variant="body1">
                      {waiter.name} ({waiter.username})
                    </Typography>
                    <Typography
                      textOverflow="ellipsis"
                      variant="caption"
                      color="textSecondary"
                    >
                      Assigned to areas:{" "}
                      {waiter.assignedDiningAreas
                        ?.map((area) => area.diningArea?.name)
                        .join(", ") || "None"}
                    </Typography>
                  </Stack>
                </ListItemText>
              </ListItem>
            ))}
          </List>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          disabled={isPending || assigningWaiter || unAssigningWaiter}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
