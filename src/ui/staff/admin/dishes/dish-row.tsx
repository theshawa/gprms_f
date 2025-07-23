import { getBackendErrorMessage } from "@/backend";
import { getCloudinaryImageUrl } from "@/cloudinary";
import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import type { Dish } from "@/interfaces/dish";
import { DishesService } from "@/services/staff/admin/dishes";
import { formatCurrency } from "@/utils/currency-format";
import { Button, Stack, TableCell, TableRow, Typography } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FC, useMemo, useState } from "react";
import { QKs } from "../../query-keys";
import { IngredientsViewDialog } from "./ingredients-view-dialog";
import { ManageDishDialog } from "./manage-dish-dialog";

export const DishRow: FC<{ dish: Dish }> = ({ dish }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [ingredientsViewDialogOpen, setIngredientsViewDialogOpen] =
    useState(false);

  const queryClient = useQueryClient();

  const { showError, showSuccess } = useAlert();

  const { confirm } = useConfirmation();

  const { mutate: deleteDish, isPending: isDeleting } = useMutation({
    mutationFn: () => DishesService.delete(dish.id),
    mutationKey: ["admin_manageDishes_deleteDish"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QKs.admin_dishes });
      showSuccess("Dish deleted successfully.");
    },
    onError: (err) => {
      showError(`Failed to delete dish: ${getBackendErrorMessage(err)}`);
    },
  });

  const ingredientsStatus = useMemo(() => {
    const outOfStock = dish.ingredients.filter(
      (i) => !i.ingredient.stockQuantity
    );

    if (outOfStock.length) {
      return {
        color: "error",
        text: `${outOfStock.length} Ingredient${
          outOfStock.length > 1 ? "s" : ""
        } Out of Stock`,
      };
    }

    const lowStock = dish.ingredients.filter(
      (i) => i.ingredient.stockQuantity < i.ingredient.lowStockThreshold
    );

    if (lowStock.length) {
      return {
        color: "warning",
        text: `${lowStock.length} Ingredient${
          lowStock.length > 1 ? "s" : ""
        } Low Stock`,
      };
    }

    return {
      color: "success",
      text: "All In Stock",
    };
  }, [dish]);

  return (
    <>
      <TableRow>
        <TableCell>
          {dish.image ? (
            <img
              src={getCloudinaryImageUrl(dish.image)}
              width={100}
              height={100}
              className="aspect-square object-cover"
            />
          ) : (
            <Typography variant="body2" color="textSecondary">
              No Image
            </Typography>
          )}
        </TableCell>
        <TableCell sx={{ textTransform: "capitalize" }}>{dish.name}</TableCell>
        <TableCell>{dish.description}</TableCell>
        <TableCell>{formatCurrency(dish.price)}</TableCell>
        <TableCell>
          {/* <Chip
            size="small"
            color={ingredientsStatus.color as any}
            label={ingredientsStatus.text}
            sx={{ textTransform: "uppercase" }}
          /> */}
          <Typography
            color={ingredientsStatus.color}
            fontWeight="500"
            variant="body2"
          >
            {ingredientsStatus.text}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing={0.5}>
            <Button
              size="small"
              onClick={() => setIngredientsViewDialogOpen(true)}
              disabled={isDeleting}
              color="info"
            >
              View Ingredients
            </Button>
            <Button
              size="small"
              onClick={() => setEditDialogOpen(true)}
              disabled={isDeleting}
            >
              Edit
            </Button>
            <Button
              size="small"
              color="error"
              disabled={isDeleting}
              onClick={async () => {
                if (
                  await confirm({
                    title: "Delete Dish",
                    message: `Are you sure you want to delete the dish "${dish.name}"? This action cannot be undone.`,
                    confirmText: "Yes, Delete Dish",
                    confirmButtonDanger: true,
                  })
                ) {
                  deleteDish();
                }
              }}
            >
              Delete
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
      <ManageDishDialog
        editingDish={dish}
        handleClose={() => setEditDialogOpen(false)}
        open={editDialogOpen}
      />
      <IngredientsViewDialog
        open={ingredientsViewDialogOpen}
        dish={dish}
        handleClose={() => setIngredientsViewDialogOpen(false)}
      />
    </>
  );
};
