import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import type { DiningArea } from "@/interfaces/dining-area";
import { DiningAreasService } from "@/services/dining-areas";
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

export const ManageDininAreaDialog: FC<{
  open: boolean;
  handleClose: () => void;
  onManageSuccess: (v: Partial<DiningArea>) => void;
  editingDiningArea?: DiningArea;
}> = ({ handleClose, open, onManageSuccess, editingDiningArea }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInputs>();

  const { showSuccess, showError } = useAlert();

  useEffect(() => {
    reset(
      editingDiningArea ?? {
        description: "",
        name: "",
      }
    );
  }, [editingDiningArea]);

  const onSubmit = async (data: FormInputs) => {
    try {
      if (editingDiningArea) {
        await DiningAreasService.update(
          editingDiningArea.id,
          data.name,
          data.description
        );
      } else {
        await DiningAreasService.create(data.name, data.description);
        reset({
          name: "",
          description: "",
        });
      }
      showSuccess(
        `Dining area ${editingDiningArea ? "updated" : "created"} successfully!`
      );
      onManageSuccess(data);
      handleClose();
    } catch (error) {
      showError(
        `Failed to create dining area: ${getBackendErrorMessage(error)}`
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
        {editingDiningArea ? "Update" : "New"} Dining Area
      </DialogTitle>
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
          {editingDiningArea ? "Update" : "Create"}
        </Button>
        <Button onClick={handleClose} type="reset" disabled={isSubmitting}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
