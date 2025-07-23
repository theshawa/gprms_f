import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import type { Ingredient } from "@/interfaces/ingredient";
import { IngredientsService } from "@/services/staff/admin/ingredients";
import { formatCurrency } from "@/utils/currency-format";
import {
  Button,
  Chip,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { QKs } from "../../query-keys";
import { ManageIngredientDialog } from "./manage-ingredient-dialog";
import { ManageStocksDialog } from "./manage-stocks-dialog";

export const IngredientRow: FC<{
  ingredient: Ingredient;
}> = ({ ingredient }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [manageStocksDialogOpen, setManageStocksDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { showError, showSuccess } = useAlert();

  const { confirm } = useConfirmation();

  const { mutate: deleteIngredient, isPending: isDeleting } = useMutation({
    mutationFn: () => IngredientsService.delete(ingredient.id),
    mutationKey: ["admin_manageIngredients_deleteINgredient"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QKs.admin_ingredients });
      showSuccess("Ingredient deleted successfully.");
    },
    onError: (err) => {
      showError(`Failed to delete ingredient: ${getBackendErrorMessage(err)}`);
    },
  });

  const stockStatusColor = !ingredient.stockQuantity
    ? "error"
    : ingredient.stockQuantity <= ingredient.lowStockThreshold
    ? "warning"
    : "success";

    
  

  return (
    <>
      <TableRow>
        <TableCell>{ingredient.name}</TableCell>
        <TableCell>{ingredient.description || "-"}</TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography
              fontWeight="600"
              color={stockStatusColor}
              variant="body2"
            >
              {ingredient.stockQuantity} {ingredient.unit}
            </Typography>
            <Chip
              size="small"
              sx={{ textTransform: "uppercase" }}
              color={stockStatusColor}
              label={
                !ingredient.stockQuantity
                  ? "Out of Stock"
                  : ingredient.stockQuantity <= ingredient.lowStockThreshold
                  ? "Low Stock"
                  : "In Stock"
              }
            />
          </Stack>
        </TableCell>
        <TableCell>
          {ingredient.lowStockThreshold} {ingredient.unit}
        </TableCell>
        <TableCell>{formatCurrency(ingredient.costPerUnit)}</TableCell>
        <TableCell align="right">
          <Stack direction="row" justifyContent="end" spacing={0.5}>
            <Button
              color="info"
              sx={{ flexShrink: 0 }}
              onClick={() => setManageStocksDialogOpen(true)}
            >
              Manage Stocks
            </Button>
            <Button onClick={() => setEditDialogOpen(true)}>Edit</Button>
            <Button color="error" disabled={isDeleting} onClick={async () => {
                if (
                  await confirm({
                    title: "Delete Ingredient",
                    message: `Are you sure you want to delete the ingredient "${ingredient.name}"? This action cannot be undone.`,
                    confirmText: "Yes, Delete Ingredient",
                    confirmButtonDanger: true,
                  })
                ) {
                  deleteIngredient();
                }
              }}>Delete</Button>
          </Stack>
        </TableCell>
      </TableRow>
      <ManageIngredientDialog
        editingIngredient={ingredient}
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
      />
      <ManageStocksDialog
        open={manageStocksDialogOpen}
        handleClose={() => setManageStocksDialogOpen(false)}
        ingredient={ingredient}
      />
    </>
  );
};
