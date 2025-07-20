import type { Ingredient } from "@/interfaces/ingredient";
import { IngredientsService } from "@/services/ingredients";
import { EggAlt } from "@mui/icons-material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { type FC, useEffect, useState } from "react";
import { QKs } from "../../query-keys";
import { PageError } from "../../shared/page-error";
import { PageLayout } from "../../shared/page-layout";
import { PageLoader } from "../../shared/page-loader";
import { FilterBar } from "./filter-bar";
import { IngredientRow } from "./ingredient-row";
import { ManageIngredientDialog } from "./manage-ingredient-dialog";

export const Admin_IngredientsPage: FC = () => {
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [stockLevelFilter, setStockLevelFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [showingRows, setShowingRows] = useState<Ingredient[]>([]);

  const {
    data: ingredients,
    isPending,
    error,
  } = useQuery({
    queryKey: QKs.admin_ingredients,
    queryFn: () => IngredientsService.getAll(),
  });

  useEffect(() => {
    let list = ingredients;
    if (!list) {
      setShowingRows([]);
      return;
    }
    if (stockLevelFilter) {
      switch (stockLevelFilter) {
        case "out":
          list = list.filter((li) => !li.stockQuantity);
          break;
        case "low":
          list = list.filter(
            (li) => li.stockQuantity && li.stockQuantity <= li.lowStockThreshold
          );
          break;
        default:
          list = list.filter((li) => li.stockQuantity > li.lowStockThreshold);
          break;
      }
    }

    if (searchFilter.trim()) {
      list = list.filter(
        (li) =>
          li.name.toLowerCase().includes(searchFilter.trim().toLowerCase()) ||
          li.description
            .toLowerCase()
            .includes(searchFilter.trim().toLowerCase())
      );
    }

    setShowingRows(list);
  }, [ingredients, stockLevelFilter, searchFilter]);

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="ingredients list" error={error} />;
  }

  return (
    <>
      <PageLayout
        title="Ingredients"
        subtitle="View and manage ingredients"
        button={{
          text: "New Ingredient",
          onClick: () => setNewDialogOpen(true),
          icon: <EggAlt />,
        }}
      >
        <FilterBar
          stockLevelFilter={stockLevelFilter}
          setStockLevelFilter={setStockLevelFilter}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1600 }}>
            <TableHead>
              <TableRow>
                <TableCell width="20%">Name</TableCell>
                <TableCell width="15%">Description</TableCell>
                <TableCell width="15%">Stocks</TableCell>
                <TableCell width="10%">Low Stock Treshold</TableCell>
                <TableCell width="10%">Cost per Unit</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showingRows.map((i) => (
                <IngredientRow ingredient={i} key={i.id} />
              ))}
              {!showingRows.length && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="textSecondary">
                      No ingredients found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </PageLayout>
      <ManageIngredientDialog
        open={newDialogOpen}
        handleClose={() => setNewDialogOpen(false)}
      />
    </>
  );
};
