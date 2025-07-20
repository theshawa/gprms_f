import type { Ingredient } from "@/interfaces/ingredient";
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
}> = ({ ingredient }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [manageStocksDialogOpen, setManageStocksDialogOpen] = useState(false);

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
            <Button color="error">Delete</Button>
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
