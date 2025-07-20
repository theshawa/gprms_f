import type { Dish } from "@/interfaces/dish";
import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import type { FC } from "react";

export const IngredientsViewDialog: FC<{
  open: boolean;
  handleClose: () => void;
  dish: Dish;
}> = ({ open, dish, handleClose }) => {
  return (
    <Dialog open={open} maxWidth="lg">
      <DialogTitle>Ingredients of {dish.name}</DialogTitle>
      <DialogContent dividers>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 600 }} size="small">
            <TableHead>
              <TableRow>
                <TableCell width="50%">Ingredient</TableCell>
                <TableCell width="20%">Quantity</TableCell>
                <TableCell align="right">Stock Level</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dish.ingredients.map((di) => (
                <TableRow key={di.dish.id}>
                  <TableCell>{di.ingredient.name}</TableCell>
                  <TableCell>
                    {di.quantity} {di.ingredient.unit}
                  </TableCell>
                  <TableCell align="right">
                    <Chip
                      size="small"
                      sx={{ textTransform: "uppercase" }}
                      color={
                        !di.ingredient.stockQuantity
                          ? "error"
                          : di.ingredient.stockQuantity <=
                            di.ingredient.lowStockThreshold
                          ? "warning"
                          : "success"
                      }
                      label={
                        !di.ingredient.stockQuantity
                          ? "Out of Stock"
                          : di.ingredient.stockQuantity <=
                            di.ingredient.lowStockThreshold
                          ? "Low Stock"
                          : "In Stock"
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
