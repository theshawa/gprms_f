import { getBackendErrorMessage } from "@/backend";
import { StaffRole } from "@/enums/staff-role";
import { useAlert } from "@/hooks/useAlert";
import type { DiningArea } from "@/interfaces/dining-area";
import type { StaffUser } from "@/interfaces/staff-user";
import type { WaiterAssignment } from "@/interfaces/waiter-assignment";
import { DiningAreasService } from "@/services/dining-areas";
import { StaffService } from "@/services/staff";
import { Add, Close, Person, Remove, Search } from "@mui/icons-material";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  InputAdornment,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { type FC, useEffect, useState } from "react";

const WaitersList: FC<{
  waiters: StaffUser[];
  listItemAction: (id: number) => void;
  iconIsRemove?: boolean;
  headerMessage: string;
  disabled?: boolean;
}> = ({ waiters, listItemAction, iconIsRemove, headerMessage, disabled }) => {
  const [showingItems, setShowingItems] = useState<StaffUser[]>(waiters);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setShowingItems(waiters);
    } else {
      const lowerSearchTerm = searchTerm.trim().toLowerCase();
      setShowingItems(
        waiters.filter(
          (waiter) =>
            waiter.name.toLowerCase().includes(lowerSearchTerm) ||
            waiter.username.toLowerCase().includes(lowerSearchTerm)
        )
      );
    }
  }, [waiters, searchTerm]);

  return (
    <Grid
      component={Paper}
      px={1}
      size={1}
      sx={
        disabled
          ? { opacity: 0.5, pointerEvents: "none", userSelect: "none" }
          : {}
      }
    >
      <List disablePadding>
        <ListSubheader>
          <Stack pb={2}>
            <Typography variant="inherit">{headerMessage}</Typography>
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

        {showingItems.map((waiter) => (
          <ListItem
            key={waiter.id}
            secondaryAction={
              <IconButton
                onClick={() => listItemAction(waiter.id)}
                color={iconIsRemove ? "error" : "primary"}
                edge="end"
              >
                {iconIsRemove ? <Remove /> : <Add />}
              </IconButton>
            }
          >
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText>
              {waiter.name} ({waiter.username})
            </ListItemText>
          </ListItem>
        ))}
      </List>
    </Grid>
  );
};

export const AssignWaitersDialog: FC<{
  open: boolean;
  handleClose: () => void;
  diningArea: DiningArea;
  setParentAssignedWaitersCount: (count: number) => void;
}> = ({ open, handleClose, diningArea, setParentAssignedWaitersCount }) => {
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

  const [unAssignedWaiters, setUnAssignedWaiters] = useState<StaffUser[]>([]);
  const [assignedWaiters, setAssignedWaiters] = useState<StaffUser[]>([]);

  useEffect(() => {
    if (!data) {
      setUnAssignedWaiters([]);
      setAssignedWaiters([]);
      return;
    }
    setAssignedWaiters(data.assignedWaiters);
    setUnAssignedWaiters(
      data.allWaiters.filter(
        (waiter) =>
          !data.assignedWaiters.some((assigned) => assigned.id === waiter.id)
      )
    );
  }, [data]);

  const { showError, showSuccess } = useAlert();

  const sortWaiters = () => {
    setUnAssignedWaiters((prev) =>
      [...prev].sort((a, b) => a.name.localeCompare(b.name))
    );
    setAssignedWaiters((prev) =>
      [...prev].sort((a, b) => a.name.localeCompare(b.name))
    );
  };

  const { mutate: assignWaiterMutation, isPending: assigningWaiter } =
    useMutation<WaiterAssignment, AxiosError, number>({
      mutationFn: (waiterId: number) =>
        DiningAreasService.assignWaiter(diningArea.id, waiterId),
      onSuccess: ({ waiterId }) => {
        showSuccess("Waiter assigned successfully.");
        setAssignedWaiters((prev) => [
          ...prev,
          unAssignedWaiters.find((w) => w.id === waiterId)!,
        ]);
        setUnAssignedWaiters((prev) => prev.filter((w) => w.id !== waiterId));
        sortWaiters();

        setParentAssignedWaitersCount(assignedWaiters.length + 1);
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
        setUnAssignedWaiters((prev) => [
          ...prev,
          assignedWaiters.find((w) => w.id === waiterId)!,
        ]);
        setAssignedWaiters((prev) => prev.filter((w) => w.id !== waiterId));
        sortWaiters();

        setParentAssignedWaitersCount(assignedWaiters.length - 1);
      },
      onError: (err) => {
        showError("Failed to unassign waiter: " + getBackendErrorMessage(err));
      },
    });

  return (
    <Dialog open={open} maxWidth="md" fullWidth>
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
          <Grid
            container
            minHeight={400}
            spacing={2}
            columns={{ xs: 1, sm: 2 }}
          >
            <WaitersList
              waiters={unAssignedWaiters}
              listItemAction={assignWaiterMutation}
              disabled={assigningWaiter}
              iconIsRemove={false}
              headerMessage={
                unAssignedWaiters.length === 0
                  ? "All waiters are assigned to this area."
                  : "Unassigned Waiters"
              }
            />
            <WaitersList
              waiters={assignedWaiters}
              listItemAction={unAssignWaiterMutation}
              disabled={unAssigningWaiter}
              iconIsRemove={true}
              headerMessage={
                assignedWaiters.length === 0
                  ? "No waiters assigned to this area yet."
                  : `${assignedWaiters.length} Waiter${
                      assignedWaiters.length === 1 ? "" : "s"
                    } Assigned`
              }
            />
          </Grid>
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
