import type { DiningTable } from "@/interfaces/dining-table";
import { DiningTablesService } from "@/services/dining-tables";
import { TableRestaurant } from "@mui/icons-material";
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
import { PageError } from "../../shared/page-error";
import { PageLayout } from "../../shared/page-layout";
import { PageLoader } from "../../shared/page-loader";
import { DiningTableRow } from "./dining-table-row";
import { FilterBar } from "./filter-bar";
import { ManageDiningTableDialog } from "./manage-dining-table-dialog";

export const Admin_ManageDiningTablesPage: FC = () => {
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  const [diningAreaFilter, setDiningAreaFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");
  const [showingRows, setShowingRows] = useState<DiningTable[]>([]);

  const {
    data: diningTables,
    refetch,
    isPending,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ["admin_manageDiningTables_home"],
    queryFn: () => DiningTablesService.getAll(),
  });

  useEffect(() => {
    if (!diningTables) {
      setShowingRows([]);
      return;
    }

    let filteredData = diningTables;
    if (diningAreaFilter) {
      filteredData = filteredData.filter(
        (dt) => dt.diningArea?.id === parseInt(diningAreaFilter)
      );
    }

    if (searchFilter.trim().length) {
      const searchLower = searchFilter.toLowerCase();
      filteredData = filteredData.filter(
        (dt) =>
          dt.name.toLowerCase().includes(searchLower) ||
          dt.diningArea?.name.toLowerCase().includes(searchLower)
      );
    }

    setShowingRows(filteredData);
  }, [diningTables, diningAreaFilter, searchFilter]);

  if (isPending || isRefetching) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="dining tables list" error={error} />;
  }

  return (
    <>
      <PageLayout
        title="Dining Tables"
        subtitle="Create, edit, and organize dining tables for your restaurant"
        button={{
          icon: <TableRestaurant />,
          text: "New Dining Table",
          onClick: () => setNewDialogOpen(true),
        }}
      >
        <FilterBar
          diningAreaFilter={diningAreaFilter}
          setDiningAreaFilter={setDiningAreaFilter}
          searchFilter={searchFilter}
          setSearchFilter={setSearchFilter}
        />
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell width="20%">Name</TableCell>
                <TableCell width="20%">Dining Area</TableCell>
                <TableCell width="15%">Max Seats</TableCell>
                <TableCell width="15%">Is Reservable</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {showingRows.map((dt) => (
                <DiningTableRow
                  diningTable={dt}
                  key={dt.id}
                  setDiningAreaFilter={setDiningAreaFilter}
                  onDelete={() => refetch()}
                />
              ))}
              {!showingRows.length && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography variant="body2" color="textSecondary">
                      No dining tables found.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </PageLayout>
      <ManageDiningTableDialog
        handleClose={() => setNewDialogOpen(false)}
        open={newDialogOpen}
        rereshParent={() => refetch()}
      />
    </>
  );
};
