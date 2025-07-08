import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import type { FC } from "react";
import { useForm } from "react-hook-form";

type FormInputs = {
  name: string;
  description: string;
};

export const ManageLocationDialog: FC<{
  open: boolean;
  handleClose: () => void;
}> = ({ handleClose, open }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormInputs>();

  const onSubmit = async (data: FormInputs) => {
    console.log("Form submitted with data:", data);
    // Here you would typically call an API to create the location
    // For example:
    // await LocationService.createLocation(data);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>New Location</DialogTitle>
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
          Create
        </Button>
        <Button onClick={handleClose} type="reset" disabled={isSubmitting}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
