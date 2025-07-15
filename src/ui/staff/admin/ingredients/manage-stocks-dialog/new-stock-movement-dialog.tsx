import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import type { Ingredient } from "@/interfaces/ingredient";
import type { IngredientStockMovement } from "@/interfaces/ingredient-stock-movement";
import { IngredientsService } from "@/services/ingredients";
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
import type { FC } from "react";
import { Controller, useForm } from "react-hook-form";

export type FormInputs = {
  type: "addition" | "reduction";
  quantity: number;
  reason: string;
};

export const NewStockMovementDialog: FC<{
  ingredient: Ingredient;
  onStockMovementCreated: (sm: IngredientStockMovement) => void;
  open: boolean;
  handleClose: () => void;
}> = ({ ingredient, onStockMovementCreated, open, handleClose }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
    control,
    watch,
  } = useForm<FormInputs>({
    defaultValues: {
      type: "addition",
      quantity: 1,
      reason: "",
    },
  });

  const { showSuccess, showError } = useAlert();

  const onSubmit = async (data: FormInputs) => {
    try {
      const mutation = (data.type === "reduction" ? -1 : 1) * data.quantity;
      const mv = await IngredientsService.createStockMovement(
        ingredient.id,
        mutation,
        data.reason
      );
      showSuccess(
        `Stock movement created successfully! Stock quantity of ${
          ingredient.name
        } ${data.type === "addition" ? "increased" : "reduced"} to ${
          ingredient.stockQuantity + mutation
        } ${ingredient.unit}`
      );
      reset();
      onStockMovementCreated(mv);
      handleClose();
    } catch (error) {
      showError(
        `Failed to create stock movement: ${getBackendErrorMessage(error)}`
      );
    }
  };

  const movementType = watch("type");

  return (
    <Dialog open={open} component="form" onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle>New Stock Movement</DialogTitle>
      <DialogContent>
        <FormControl
          fullWidth
          margin="dense"
          variant="filled"
          error={!!errors.type}
        >
          <InputLabel id="type-select-label">Movement Type</InputLabel>
          <Controller
            name="type"
            control={control}
            rules={{ required: "Field is required" }}
            render={({ field }) => (
              <Select
                {...register("type", {
                  required: {
                    message: "Field is required",
                    value: true,
                  },
                })}
                {...field}
                labelId="type-select-label"
                label="Role"
                variant="filled"
                margin="dense"
              >
                <MenuItem value="addition">Addition</MenuItem>
                <MenuItem value="reduction">Reduction</MenuItem>
              </Select>
            )}
          />
          <FormHelperText>{errors.type?.message}</FormHelperText>
        </FormControl>
        <TextField
          {...register("quantity", {
            required: {
              message: "Field is required",
              value: true,
            },
            min: {
              value: 1,
              message: "Quantity must be a positive number",
            },
            valueAsNumber: true,
          })}
          label={`Quantity (${ingredient.unit})`}
          type="number"
          fullWidth
          variant="filled"
          margin="dense"
          error={!!errors.quantity}
          helperText={errors.quantity?.message}
        />
        <TextField
          {...register("reason", {
            required: {
              message: "Field is required",
              value: true,
            },
          })}
          label="Reason"
          fullWidth
          multiline
          rows={3}
          variant="filled"
          margin="dense"
          helperText={errors.reason?.message}
          error={!!errors.reason}
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color={movementType === "addition" ? "success" : "warning"}
          type="submit"
          disabled={isSubmitting}
        >
          {movementType === "addition" ? "Add Stock" : "Reduce Stock"}
        </Button>
        <Button type="reset" disabled={isSubmitting} onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
