import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import type { Location } from "@/interfaces/location";
import { LocationsService } from "@/services/locations";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { type FC, useEffect } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  name: string;
  description: string;
};

export const ManageLocationDialog: FC<{
  open: boolean;
  handleClose: () => void;
  onManageSuccess: (v: Partial<Location>) => void;
  editingLocation?: Location;
}> = ({ handleClose, open, onManageSuccess, editingLocation }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInputs>();

  const { showSuccess, showError } = useAlert();

  useEffect(() => {
    reset(
      editingLocation ?? {
        description: "",
        name: "",
      }
    );
  }, [editingLocation]);

  const onSubmit = async (data: FormInputs) => {
    try {
      if (editingLocation) {
        await LocationsService.updateLocation(
          editingLocation.id,
          data.name,
          data.description
        );
      } else {
        await LocationsService.createLocation(data.name, data.description);
        reset({
          name: "",
          description: "",
        });
      }
      showSuccess(
        `Location ${editingLocation ? "updated" : "created"} successfully!`
      );
      onManageSuccess(data);
      handleClose();
    } catch (error) {
      showError(`Failed to create location: ${getBackendErrorMessage(error)}`);
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>{editingLocation ? "Update" : "New"} Location</DialogTitle>
      <DialogContent>
        <TextField
          {...register("name", {
            required: {
              message: "Field is required",
              value: true,
            },
          })}
          label="Name"
          variant="filled"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          margin="dense"
          placeholder="e.g., Main Dining Area, Outdoor Patio"
        />
        <TextField
          {...register("description", {
            required: {
              message: "Field is required",
              value: true,
            },
          })}
          label="Description"
          variant="filled"
          fullWidth
          multiline
          rows={3}
          error={!!errors.description}
          helperText={errors.description?.message}
          margin="dense"
          placeholder="Describe this location, e.g., 'Main dining area with 50 seats, suitable for family gatherings.'"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {editingLocation ? "Update" : "Create"}
        </Button>
        <Button onClick={handleClose} type="reset" disabled={isSubmitting}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
