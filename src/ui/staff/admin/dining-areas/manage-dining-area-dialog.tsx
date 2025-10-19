import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import type { DiningArea } from "@/interfaces/dining-area";
import { DiningAreasService } from "@/services/staff/admin/dining-areas";
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { type FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { QKs } from "../../query-keys";
import { ImageInput } from "../../shared/image-input";

type FormInputs = {
  name: string;
  description: string;
  imageFile?: File;
  isReservable: boolean;
  reservationSeatsCount: number;
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
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      name: "",
      description: "",
      reservationSeatsCount: 0,
      isReservable: false,
    },
  });

  const { showSuccess, showError } = useAlert();
  const queryClient = useQueryClient();

  const isEditing = !!editingDiningArea;

  useEffect(() => {
    if (editingDiningArea) {
      reset({
        name: editingDiningArea.name,
        description: editingDiningArea.description,
        reservationSeatsCount: editingDiningArea.reservationSeatsCount,
        isReservable: editingDiningArea.reservationSeatsCount > 0,
      });
    } else {
      reset({
        name: "",
        description: "",
        reservationSeatsCount: 0,
        isReservable: false,
      });
    }
  }, [editingDiningArea, reset]);

  const isReservable = watch("isReservable");

  const onSubmit = async (data: FormInputs) => {
    try {
      if (isEditing) {
        await DiningAreasService.update(
          editingDiningArea!.id,
          data.name.trim(),
          data.description.trim(),
          data.imageFile || null,
          Number(data.isReservable ? data.reservationSeatsCount : 0)
        );
      } else {
        await DiningAreasService.create(
          data.name.trim(),
          data.description.trim(),
          data.imageFile!,
          Number(data.isReservable ? data.reservationSeatsCount : 0)
        );
        reset();
      }

      showSuccess(`Dining area ${isEditing ? "updated" : "created"} successfully!`);
      queryClient.invalidateQueries({ queryKey: QKs.admin_diningAreas });
      handleClose();
    } catch (error) {
      showError(
        `Failed to ${isEditing ? "update" : "create"} dining area: ${getBackendErrorMessage(error)}`
      );
    }
  };

  return (
    <Dialog open={open} fullWidth maxWidth="sm" component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>{isEditing ? "Update" : "New"} Dining Area</DialogTitle>
      <DialogContent dividers>
        {/* NAME */}
        <TextField
          {...register("name", {
            required: "Name is required",
            minLength: {
              value: 3,
              message: "Name must be at least 3 characters long",
            },
            maxLength: {
              value: 50,
              message: "Name cannot exceed 50 characters",
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

        {/* IMAGE FILE */}
        <Controller
          control={control}
          name="imageFile"
          rules={{
            validate: (file) => {
              if (!isEditing && !file) return "Image is required";
              if (file && !file.type.startsWith("image/")) return "Only image files are allowed";
              if (file && file.size > 2 * 1024 * 1024) return "Image size must be under 2MB";
              return true;
            },
          }}
          render={({ field: { onChange, value } }) => (
            <ImageInput
              value={value ?? null}
              onChange={onChange}
              label="Dining Area Image"
              error={errors.imageFile?.message}
              helperText={
                isEditing
                  ? "Upload a new image to replace the existing one (optional)."
                  : "Upload an image for this dining area."
              }
              defaultImageUrl={editingDiningArea?.image}
              cloudinary
            />
          )}
        />

        {/* DESCRIPTION */}
        <TextField
          {...register("description", {
            required: "Description is required",
            minLength: {
              value: 10,
              message: "Description should be at least 10 characters",
            },
            maxLength: {
              value: 200,
              message: "Description cannot exceed 200 characters",
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

        {/* RESERVATION SECTION */}
        <Box pt={3}>
          <Typography variant="overline" color="text.secondary">
            Reservations
          </Typography>
        </Box>

        {/* IS RESERVABLE */}
        <Controller
          control={control}
          name="isReservable"
          render={({ field: { value, onChange } }) => (
            <Stack component={"label"} mt={2} direction={"row"} alignItems={"center"}>
              <Typography>Reservable?</Typography>
              <Checkbox checked={value} onChange={(e) => onChange(e.target.checked)} />
            </Stack>
          )}
        />

        {isReservable && (
          <>
            <TextField
              {...register("reservationSeatsCount", {
                required: "Reservation seats count is required",
                min: { value: 1, message: "Must be at least 1" },
              })}
              type="number"
              label="Allocated Reservation Seats Count"
              variant="filled"
              fullWidth
              error={!!errors.reservationSeatsCount}
              helperText={errors.reservationSeatsCount?.message}
              margin="dense"
              placeholder="Enter the number of seats available for reservation."
            />
          </>
        )}
      </DialogContent>

      <DialogActions>
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
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {isEditing
            ? isSubmitting
              ? "Updating..."
              : "Update"
            : isSubmitting
            ? "Creating..."
            : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
