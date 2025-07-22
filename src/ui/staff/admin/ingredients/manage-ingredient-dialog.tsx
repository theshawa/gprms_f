import { getBackendErrorMessage } from "@/backend";
import { Currency, IngredientMeasuringUnits } from "@/constants";
import { useAlert } from "@/hooks/useAlert";
import type { Ingredient } from "@/interfaces/ingredient";
import { IngredientsService } from "@/services/staff/ingredients";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { type FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { QKs } from "../../query-keys";

type FormInputs = {
  name: string;
  description: string;
  costPerUnit: number;
  unit: string;
  initialQuantity: number;
  lowStockThreshold: number;
};

export const ManageIngredientDialog: FC<{
  open: boolean;
  handleClose: () => void;
  editingIngredient?: Ingredient;
}> = ({ handleClose, open, editingIngredient }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      unit: "kg",
    },
  });

  const queryClient = useQueryClient();

  const { showSuccess, showError } = useAlert();

  useEffect(() => {
    reset(editingIngredient);
  }, [editingIngredient]);

  const onSubmit = async (data: FormInputs) => {
    try {
      if (editingIngredient) {
        await IngredientsService.update(editingIngredient.id, data);
      } else {
        await IngredientsService.create(data);
        reset();
      }

      queryClient.invalidateQueries({ queryKey: QKs.admin_ingredients });

      showSuccess(
        `Ingredient ${editingIngredient ? "updated" : "created"} successfully!`
      );

      handleClose();
    } catch (error) {
      showError(
        `Failed to create ingredient: ${getBackendErrorMessage(error)}`
      );
    }
  };

  const unit = watch("unit");

  return (
    <Dialog open={open} component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>
        {editingIngredient ? "Update" : "New"} Ingredient
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
          placeholder="e.g., Chicken Breast, Olive Oil, etc."
        />
        <TextField
          {...register("description", {
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
          placeholder="e.g., Fresh chicken breast, Extra virgin olive oil, etc."
        />
        <TextField
          {...register("costPerUnit", {
            required: {
              message: "Field is required",
              value: true,
            },
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Cost per unit must be a positive number",
            },
          })}
          label={`Cost per Unit (${Currency.toUpperCase()})`}
          variant="filled"
          fullWidth
          type="number"
          error={!!errors.costPerUnit}
          helperText={errors.costPerUnit?.message}
          margin="dense"
          placeholder="e.g., 5.99"
        />
        <FormControl
          fullWidth
          margin="dense"
          variant="filled"
          error={!!errors.unit}
        >
          <InputLabel id="unit-select-label">Unit</InputLabel>
          <Controller
            name="unit"
            control={control}
            rules={{ required: "Field is required" }}
            render={({ field }) => (
              <Select
                {...register("unit", {
                  required: {
                    message: "Field is required",
                    value: true,
                  },
                })}
                {...field}
                labelId="unit-select-label"
                label="Unit"
                variant="filled"
                margin="dense"
              >
                {IngredientMeasuringUnits.map((imu) => (
                  <MenuItem key={imu} value={imu}>
                    {imu}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.unit?.message}</FormHelperText>
        </FormControl>
        {!editingIngredient && (
          <TextField
            {...register("initialQuantity", {
              required: {
                message: "Field is required",
                value: true,
              },
              valueAsNumber: true,
              min: {
                value: 0,
                message: "Initial quantity must be a positive number",
              },
            })}
            label={`Initial Quantity (${unit})`}
            variant="filled"
            fullWidth
            type="number"
            error={!!errors.initialQuantity}
            helperText={errors.initialQuantity?.message}
            margin="dense"
            placeholder="e.g., 450"
          />
        )}

        <TextField
          {...register("lowStockThreshold", {
            required: {
              message: "Field is required",
              value: true,
            },
            valueAsNumber: true,
            min: {
              value: 0,
              message: "Low stock treshold a positive number",
            },
          })}
          label={`Low Stock Treshold (${unit})`}
          variant="filled"
          fullWidth
          type="number"
          error={!!errors.lowStockThreshold}
          helperText={errors.lowStockThreshold?.message}
          margin="dense"
          placeholder="e.g., 200"
        />
      </DialogContent>
      <DialogActions>
        <Button variant="contained" type="submit" disabled={isSubmitting}>
          {editingIngredient ? "Update" : "Create"}
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
