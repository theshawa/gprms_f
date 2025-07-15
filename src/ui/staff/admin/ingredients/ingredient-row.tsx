import type { Ingredient } from "@/interfaces/ingredient";
import type { IngredientStockMovement } from "@/interfaces/ingredient-stock-movement";
import { formatCurrency } from "@/utils/currency-format";
import {
  Button,
  Chip,
  Stack,
  TableCell,
  TableRow,
  Typography,
} from "@mui/material";
import { type FC, useState } from "react";
import { ManageIngredientDialog } from "./manage-ingredient-dialog";
import { ManageStocksDialog } from "./manage-stocks-dialog";

export const IngredientRow: FC<{
  ingredient: Ingredient;
  onStockMovementCreated: (v: IngredientStockMovement) => void;
}> = ({ ingredient: initialIngredient, onStockMovementCreated }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [ingredient, setIngredient] = useState<Ingredient>(initialIngredient);
  const [manageStocksDialogOpen, setManageStocksDialogOpen] = useState(false);
  return (
    <>
      <TableRow>
        <TableCell>{ingredient.name}</TableCell>
        <TableCell>{ingredient.description || "-"}</TableCell>
        <TableCell>
          <Typography fontWeight="medium" variant="body2">
            {ingredient.stockQuantity} {ingredient.unit}
          </Typography>
        </TableCell>
        <TableCell>
          <Chip
            size="small"
            sx={{ textTransform: "uppercase" }}
            color={
              !ingredient.stockQuantity
                ? "error"
                : ingredient.stockQuantity <= ingredient.lowStockThreshold
                ? "warning"
                : "success"
            }
            label={
              !ingredient.stockQuantity
                ? "Out of Stock"
                : ingredient.stockQuantity <= ingredient.lowStockThreshold
                ? "Low Stock"
                : "In Stock"
            }
          />
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
            <Button color="error">Delete</Button>
          </Stack>
        </TableCell>
      </TableRow>
      <ManageIngredientDialog
        editingIngredient={ingredient}
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        refreshParent={(v) => setIngredient((prev) => ({ ...prev, ...v }))}
      />
      <ManageStocksDialog
        open={manageStocksDialogOpen}
        handleClose={() => setManageStocksDialogOpen(false)}
        ingredient={ingredient}
        onStockMovementCreated={onStockMovementCreated}
      />
    </>
  );
};
