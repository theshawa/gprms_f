import type { Dish } from "@/interfaces/dish";
import { DishesService } from "@/services/staff/admin/dishes";
import { Fastfood } from "@mui/icons-material";
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
import { DishRow } from "./dish-row";
import { ManageDishDialog } from "./manage-dish-dialog";

export const Admin_DishesPage: FC = () => {
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const [showingRows, setShowingRows] = useState<Dish[]>([]);

  const {
    data: dishes,
    isPending,
    error,
  } = useQuery({
    queryKey: QKs.admin_dishes,
    queryFn: () => DishesService.getAll(),
  });

  useEffect(() => {
    let list = dishes;
    if (!list) {
      setShowingRows([]);
      return;
    }
    setShowingRows(list);
  }, [dishes]);

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="dishes list" error={error} />;
  }

  return (
    <>
      <PageLayout
        title="Dishes"
        subtitle="View and manage dishes"
        button={{
          text: "New Dish",
          onClick: () => setNewDialogOpen(true),
          icon: <Fastfood />,
        }}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1600 }}>
            <TableHead>
              <TableRow>
                <TableCell width="10%">Image</TableCell>
                <TableCell width="20%">Name</TableCell>
                <TableCell width="20%">Description</TableCell>
                <TableCell width="15%">Price</TableCell>
                <TableCell width="15%">Ingredients Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showingRows.map((d) => (
                <DishRow dish={d} key={d.id} />
              ))}
              {!showingRows.length && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Typography variant="body2" color="textSecondary">
                      No dishes found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </PageLayout>
      <ManageDishDialog
        open={newDialogOpen}
        handleClose={() => setNewDialogOpen(false)}
      />
    </>
  );
};
