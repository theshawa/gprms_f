import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
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
import { useQuery } from "@tanstack/react-query";
import { type FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";

type FormInputs = {
  name: string;
  diningAreaId: number;
  isReservable: boolean;
  maxSeats: number;
};

export const ManageDiningTableDialog: FC<{
  open: boolean;
  handleClose: () => void;
  rereshParent: (v: Partial<DiningTable>) => void;
  editingDiningTable?: DiningTable;
}> = ({ handleClose, open, rereshParent, editingDiningTable }) => {
  const {
    data: diningAreas,
    isPending: isDiningAreasLoading,
    error: diningAreasLoadingError,
  } = useQuery({
    queryKey: ["admin_manageDiningTablesDialog"],
    queryFn: () => DiningAreasService.getAll(),
    enabled: open,
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
      diningAreaId: 0,
      isReservable: true,
      maxSeats: 4,
      name: "",
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
      let res: Partial<DiningTable>;
      if (editingDiningTable) {
        res = await DiningTablesService.update(editingDiningTable.id, data);
      } else {
        res = await DiningTablesService.create(data);
        reset();
      }
      showSuccess(
        `Dining table ${
          editingDiningTable ? "updated" : "created"
        } successfully!`
      );
      rereshParent(res);
      handleClose();
    } catch (error) {
      showError(
        `Failed to create dining table: ${getBackendErrorMessage(error)}`
      );
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
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
                  label={field.value ? "Is Reserable" : "Not Reservable"}
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
