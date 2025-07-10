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

export const ManageDiningAreaDialog: FC<{
  open: boolean;
  handleClose: () => void;
  refreshParent: (v: Partial<DiningArea>) => void;
  editingDiningArea?: DiningArea;
}> = ({ handleClose, open, refreshParent, editingDiningArea }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      description: "",
      name: "",
    },
  });

  const { showSuccess, showError } = useAlert();

  useEffect(() => {
    reset(editingDiningArea);
  }, [editingDiningArea]);

  const onSubmit = async (data: FormInputs) => {
    try {
      let res: Partial<DiningArea>;
      if (editingDiningArea) {
        res = await DiningAreasService.update(
          editingDiningArea.id,
          data.name,
          data.description
        );
      } else {
        res = await DiningAreasService.create(data.name, data.description);
        reset();
      }
      showSuccess(
        `Dining area ${editingDiningArea ? "updated" : "created"} successfully!`
      );
      refreshParent(res);
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
      <DialogContent dividers>
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
            maxLength: {
              value: 100,
              message: "Description cannot exceed 100 characters",
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
        <Button
          onClick={() => {
            reset();
            handleClose();
          }}
          type="reset"
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
