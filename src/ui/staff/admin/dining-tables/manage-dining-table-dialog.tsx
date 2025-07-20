import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import type { DiningArea } from "@/interfaces/dining-area";
import type { DiningTable } from "@/interfaces/dining-table";
import { DiningAreasService } from "@/services/dining-areas";
import { DiningTablesService } from "@/services/dining-tables";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Switch,
  TextField,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { QKs } from "../../query-keys";

type FormInputs = {
  name: string;
  diningAreaId: number;
  isReservable: boolean;
  maxSeats: number;
};

export const ManageDiningTableDialog: FC<{
  open: boolean;
  handleClose: () => void;
  editingDiningTable?: DiningTable;
}> = ({ handleClose, open, editingDiningTable }) => {
  const queryClient = useQueryClient();

  const {
    data: diningAreas,
    isPending: isDiningAreasLoading,
    error: diningAreasLoadingError,
  } = useQuery({
    queryKey: QKs.admin_diningAreas,
    queryFn: () => DiningAreasService.getAll(),
    enabled: open,
    initialData: queryClient.getQueryData<DiningArea[]>(QKs.admin_diningAreas),
  });

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    control,
    setValue,
  } = useForm<FormInputs>({
    defaultValues: {
      isReservable: true,
    },
  });

  const { showSuccess, showError } = useAlert();

  useEffect(() => {
    reset(
      editingDiningTable ?? {
        name: "",
        diningAreaId: 0,
        isReservable: true,
        maxSeats: 4,
      }
    );
  }, [editingDiningTable]);

  useEffect(() => {
    if (diningAreas && diningAreas.length) {
      if (
        editingDiningTable &&
        diningAreas.find((da) => da.id === editingDiningTable.diningAreaId)
      ) {
        setValue("diningAreaId", editingDiningTable.diningAreaId);
      } else {
        setValue("diningAreaId", diningAreas[0].id);
      }
    }
  }, [diningAreas, open]);

  const onSubmit = async (data: FormInputs) => {
    try {
      if (editingDiningTable) {
        await DiningTablesService.update(editingDiningTable.id, data);
      } else {
        await DiningTablesService.create(data);
        reset();
      }
      showSuccess(
        `Dining table ${
          editingDiningTable ? "updated" : "created"
        } successfully!`
      );
      queryClient.invalidateQueries({ queryKey: QKs.admin_diningTables });
      handleClose();
    } catch (error) {
      showError(
        `Failed to create dining table: ${getBackendErrorMessage(error)}`
      );
    }
  };

  return (
    <Dialog open={open} component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>
        {editingDiningTable ? "Update" : "New"} Dining Table
      </DialogTitle>
      <DialogContent dividers>
        {isDiningAreasLoading ? (
          <LinearProgress />
        ) : diningAreasLoadingError ? (
          <Alert severity="error">
            Failed to load dining areas list:{" "}
            {getBackendErrorMessage(diningAreasLoadingError)}
          </Alert>
        ) : !diningAreas.length ? (
          <Alert severity="info">
            No dining areas found. Create some to continue.
          </Alert>
        ) : (
          <>
            <FormControl
              fullWidth
              margin="dense"
              variant="filled"
              error={!!errors.diningAreaId}
            >
              <InputLabel id="dining-area-select-label">Dining Area</InputLabel>
              <Controller
                name="diningAreaId"
                control={control}
                rules={{ required: "Field is required" }}
                render={({ field }) => (
                  <Select
                    {...register("diningAreaId", {
                      required: {
                        message: "Field is required",
                        value: true,
                      },
                    })}
                    {...field}
                    labelId="dining-area-select-label"
                    label="Dining Area"
                    variant="filled"
                    margin="dense"
                  >
                    {diningAreas.map((area, i) => (
                      <MenuItem key={i} value={area.id}>
                        {area.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              <FormHelperText>{errors.diningAreaId?.message}</FormHelperText>
            </FormControl>
            <TextField
              {...register("name", {
                required: {
                  message: "Field is required",
                  value: true,
                },
              })}
              label="Table Name"
              variant="filled"
              fullWidth
              error={!!errors.name}
              helperText={errors.name?.message}
              margin="dense"
              placeholder="15522"
            />

            <TextField
              {...register("maxSeats", {
                required: {
                  message: "Field is required",
                  value: true,
                },
                min: {
                  value: 1,
                  message: "Must be at least 1 seat",
                },
                valueAsNumber: true,
              })}
              label="Max Seats"
              variant="filled"
              type="number"
              fullWidth
              error={!!errors.maxSeats}
              helperText={errors.maxSeats?.message}
              margin="dense"
              placeholder="e.g., 4"
            />
            <Controller
              name="isReservable"
              control={control}
              render={({ field }) => (
                <FormControlLabel
                  sx={{ mt: 2 }}
                  control={
                    <Switch
                      {...field}
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                    />
                  }
                  label={field.value ? "Is Reservable" : "Not Reservable"}
                />
              )}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          type="submit"
          disabled={
            isSubmitting ||
            isDiningAreasLoading ||
            !!diningAreasLoadingError ||
            !diningAreas.length
          }
        >
          {editingDiningTable ? "Update" : "Create"}
        </Button>
        <Button
          onClick={() => {
            reset();
            handleClose();
          }}
          type="reset"
          disabled={isSubmitting || isDiningAreasLoading}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
