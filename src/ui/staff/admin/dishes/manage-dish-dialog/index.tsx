import { getBackendErrorMessage } from "@/backend";
import { Currency } from "@/constants";
import { useAlert } from "@/hooks/useAlert";
import type { Dish } from "@/interfaces/dish";
import type { Ingredient } from "@/interfaces/ingredient";
import { DishesService } from "@/services/dishes";
import { IngredientsService } from "@/services/ingredients";
import { QKs } from "@/ui/staff/query-keys";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { IngredientsSelector } from "./ingredients-selector";

type FormInputs = {
  name: string;
  description: string;
  price: number;
  ingredients: { ingredient: Ingredient; quantity: number }[];
};

export const ManageDishDialog: FC<{
  open: boolean;
  handleClose: () => void;
  editingDish?: Dish;
}> = ({ handleClose, open, editingDish }) => {
  const {
    data: ingredients,
    isPending: isIngredientsLoading,
    error: ingredientsLoadingError,
  } = useQuery({
    queryKey: ["admin_manageDishesDialog"],
    queryFn: () => IngredientsService.getAll(),
    enabled: open,
  });

  const queryClient = useQueryClient();

  const formMethods = useForm<FormInputs>({});

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = formMethods;

  const { showSuccess, showError } = useAlert();

  const onSubmit = async (data: FormInputs) => {
    try {
      const payload = {
        ...data,
        ingredients: data.ingredients.map((i) => ({
          id: i.ingredient.id,
          quantity: i.quantity,
        })),
      };
      if (editingDish) {
        await DishesService.update(editingDish.id, payload);
      } else {
        await DishesService.create(payload);
        reset();
      }

      queryClient.invalidateQueries({
        queryKey: QKs.admin_dishes,
      });

      showSuccess(`Dish ${editingDish ? "updated" : "created"} successfully!`);

      handleClose();
    } catch (error) {
      showError(
        `Failed to ${
          editingDish ? "update" : "create"
        } dish: ${getBackendErrorMessage(error)}`
      );
    }
  };

  useEffect(() => {
    if (editingDish) {
      reset({
        name: editingDish.name,
        description: editingDish.description,
        price: editingDish.price,
        ingredients: editingDish.ingredients.map((i) => ({
          ingredient: i.ingredient,
          quantity: i.quantity,
        })),
      });
    } else {
      reset({
        name: "",
        description: "",
        price: 0,
        ingredients: [],
      });
    }
  }, [editingDish, open]);

  return (
    <FormProvider {...formMethods}>
      <Dialog open={open} component="form" onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle>{editingDish ? "Update" : "New"} Dish</DialogTitle>
        <DialogContent dividers>
          {isIngredientsLoading ? (
            <LinearProgress />
          ) : ingredientsLoadingError ? (
            <Alert severity="error">
              Failed to load ingredients list:{" "}
              {getBackendErrorMessage(ingredientsLoadingError)}
            </Alert>
          ) : !ingredients.length ? (
            <Alert severity="info">
              No ingredients found. Create some to continue.
            </Alert>
          ) : (
            <>
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
                placeholder="Enter dish name, e.g., 'Spaghetti Bolognese'"
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
                placeholder="Describe this dish, e.g., 'A classic Italian pasta dish with rich meat sauce.'"
              />
              <TextField
                {...register("price", {
                  required: {
                    message: "Field is required",
                    value: true,
                  },
                  valueAsNumber: true,
                  min: {
                    value: 0,
                    message: "Price unit must be a positive number",
                  },
                })}
                label={`Price (${Currency.toUpperCase()})`}
                variant="filled"
                fullWidth
                type="number"
                error={!!errors.price}
                helperText={errors.price?.message}
                margin="dense"
                placeholder="e.g., 5.99"
              />
              <IngredientsSelector
                allIngredients={ingredients}
                name="ingredients"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button variant="contained" type="submit" disabled={isSubmitting}>
            {editingDish ? "Update" : "Create"}
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
    </FormProvider>
  );
};
