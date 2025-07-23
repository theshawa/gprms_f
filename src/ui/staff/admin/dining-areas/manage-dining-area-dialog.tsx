import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import type { DiningArea } from "@/interfaces/dining-area";
import { DiningAreasService } from "@/services/staff/admin/dining-areas";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { type FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { QKs } from "../../query-keys";
import { ImageInput } from "../../shared/image-input";

type FormInputs = {
  name: string;
  description: string;
  imageFile: File;
};

export const ManageDiningAreaDialog: FC<{
  open: boolean;
  handleClose: () => void;
  editingDiningArea?: DiningArea;
}> = ({ handleClose, open, editingDiningArea }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    control,
  } = useForm<FormInputs>({});

  const { showSuccess, showError } = useAlert();

  const queryClient = useQueryClient();

  useEffect(() => {
    reset(editingDiningArea);
  }, [editingDiningArea]);

  const onSubmit = async (data: FormInputs) => {
    try {
      if (editingDiningArea) {
        await DiningAreasService.update(
          editingDiningArea.id,
          data.name,
          data.description,
          data.imageFile
        );
      } else {
        await DiningAreasService.create(
          data.name,
          data.description,
          data.imageFile
        );
        reset();
      }
      showSuccess(
        `Dining area ${editingDiningArea ? "updated" : "created"} successfully!`
      );
      queryClient.invalidateQueries({
        queryKey: QKs.admin_diningAreas,
      });
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
      fullWidth
      maxWidth="sm"
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
        <Controller
          control={control}
          name="imageFile"
          render={({ field: { onChange, value } }) => (
            <ImageInput
              value={value}
              onChange={onChange}
              label="Dining Area Image"
              error={errors.imageFile?.message}
              helperText={
                editingDiningArea
                  ? "Upload a new image to replace the existing one."
                  : "Upload an image for this dining area."
              }
              defaultImageUrl={editingDiningArea?.image}
              cloudinary
            />
          )}
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
