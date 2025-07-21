import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import type { Ingredient } from "@/interfaces/ingredient";
import { IngredientsService } from "@/services/staff/ingredients";
import { formatDateTime } from "@/utils/time-format";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { NewStockMovementDialog } from "./new-stock-movement-dialog";
import { QKs } from "./query_keys";

export const ManageStocksDialog: FC<{
  open: boolean;
  handleClose: () => void;
  ingredient: Ingredient;
}> = ({ handleClose, open, ingredient }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activitiesPerPage, setActivitiesPerPage] = useState(10);
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { data, isPending, error } = useQuery({
    queryKey: QKs.admin_ingredient_stock_movements_dialog(
      ingredient.id,
      currentPage,
      activitiesPerPage
    ),
    queryFn: async () =>
      IngredientsService.getStockMovements(
        ingredient.id,
        currentPage,
        activitiesPerPage
      ),

    enabled: open,
    refetchOnWindowFocus: false,
  });

  const { showSuccess, showError } = useAlert();

  const { mutate: clearHistory, isPending: isClearingHistory } = useMutation({
    mutationFn: () => IngredientsService.clearStockMovements(ingredient.id),
    onSuccess: () => {
      showSuccess("Stock history cleared successfully.");
      queryClient.invalidateQueries({
        queryKey: QKs.admin_ingredient_stock_movements_dialog(
          ingredient.id,
          currentPage,
          activitiesPerPage
        ),
      });
    },
    onError: (err) => {
      showError(
        "Failed to clear stock history: " + getBackendErrorMessage(err)
      );
    },
  });

  const { confirm } = useConfirmation();

  return (
    <>
      <Dialog fullWidth open={open} maxWidth="md">
        <DialogTitle>Manage Stocks of {ingredient.name}</DialogTitle>
        <DialogContent>
          <Box mt={3}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 400 }} size="small">
                <TableHead>
                  <TableRow>
                    <TableCell width="20%">Qty Movement</TableCell>
                    <TableCell width="40%">Reason</TableCell>
                    <TableCell width="40%" align="right">
                      Time
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {isPending ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <LinearProgress />
                      </TableCell>
                    </TableRow>
                  ) : error ? (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Alert security="error">
                          Failed to load stock movements:{" "}
                          {getBackendErrorMessage(error)}
                        </Alert>
                      </TableCell>
                    </TableRow>
                  ) : data.movements.length ? (
                    data.movements.map((movement) => (
                      <TableRow key={movement.id}>
                        <TableCell>
                          <Typography
                            fontWeight="500"
                            variant="body2"
                            color={movement.quantity > 0 ? "green" : "red"}
                          >
                            {movement.quantity > 0 ? "+" : ""}
                            {movement.quantity} {ingredient.unit}
                          </Typography>
                        </TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell align="right">
                          {formatDateTime(movement.createdAt)}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3}>
                        <Typography variant="body2" color="textSecondary">
                          No stock movements found for this ingredient.
                        </Typography>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
                <TableFooter>
                  <TableRow>
                    <TablePagination
                      colSpan={3}
                      disabled={isPending || data?.totalCount === 0}
                      rowsPerPageOptions={
                        (data?.totalCount ?? 0) > 10 ? [10, 20] : [10]
                      }
                      count={data?.totalCount ?? -1}
                      onPageChange={(_, p) => setCurrentPage(p + 1)}
                      page={currentPage - 1}
                      onRowsPerPageChange={(e) => {
                        setActivitiesPerPage(parseInt(e.target.value, 10));
                        setCurrentPage(1);
                      }}
                      rowsPerPage={activitiesPerPage}
                    />
                  </TableRow>
                </TableFooter>
              </Table>
            </TableContainer>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={() => setNewDialogOpen(true)}>
            Update Stock
          </Button>
          <Button
            onClick={async () => {
              if (
                await confirm({
                  title: "Are you sure?",
                  message: `This will clear all stock movement history for ${ingredient.name}. This action cannot be undone.`,
                  confirmText: "Yes, Clear History",
                  confirmButtonDanger: true,
                })
              ) {
                clearHistory();
              }
            }}
            disabled={isClearingHistory || data?.movements.length === 0}
            variant="contained"
            color="error"
          >
            Clear History
          </Button>
          <Button disabled={isClearingHistory} onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <NewStockMovementDialog
        open={newDialogOpen}
        handleClose={() => setNewDialogOpen(false)}
        ingredient={ingredient}
        currentPage={currentPage}
        activitiesPerPage={activitiesPerPage}
      />
    </>
  );
};
