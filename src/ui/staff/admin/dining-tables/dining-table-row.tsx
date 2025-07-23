import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import type { DiningTable } from "@/interfaces/dining-table";
import { DiningTablesService } from "@/services/staff/dining-tables";
import { Button, Stack, TableCell, TableRow } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { SetStateAction } from "jotai";
import { type Dispatch, type FC, useState } from "react";
import { QKs } from "../../query-keys";
import { DownloadQRDialog } from "./download-qr-dialog";
import { ManageDiningTableDialog } from "./manage-dining-table-dialog";

export const DiningTableRow: FC<{
  diningTable: DiningTable;
  setDiningAreaFilter: Dispatch<SetStateAction<string>>;
}> = ({ diningTable, setDiningAreaFilter }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [downloadQrDialogOpen, setDownloadQrDialogOpen] = useState(false);

  const queryClient = useQueryClient();

  const { showError, showSuccess } = useAlert();

  const { confirm } = useConfirmation();

  const { mutate: deleteDiningArea, isPending: isDeleting } = useMutation({
    mutationFn: () => DiningTablesService.delete(diningTable.id),
    mutationKey: ["admin_manageDiningTables_deleteDiningTable"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QKs.admin_diningTables });
      showSuccess("Dining area deleted successfully.");
    },
    onError: (err) => {
      showError(`Failed to delete dining area: ${getBackendErrorMessage(err)}`);
    },
  });
  return (
    <>
      <TableRow>
        <TableCell>{diningTable.name}</TableCell>
        <TableCell>
          <Button
            onClick={() =>
              setDiningAreaFilter(diningTable.diningAreaId.toString())
            }
          >
            {diningTable.diningArea?.name ?? diningTable.diningAreaId}
          </Button>
        </TableCell>
        <TableCell>{diningTable.maxSeats}</TableCell>
        <TableCell>{diningTable.isReservable ? "Yes" : "No"}</TableCell>
        <TableCell>
          <Stack direction="row" justifyContent="end" spacing={0.5}>
            <Button
              size="small"
              color="info"
              onClick={() => setDownloadQrDialogOpen(true)}
              disabled={isDeleting}
            >
              Download QR
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
                    title: "Delete Dining Table",
                    message: `Are you sure you want to delete the dining table "${diningTable.name}"? This action cannot be undone.`,
                    confirmText: "Yes, Delete Dining Table",
                    confirmButtonDanger: true,
                  })
                ) {
                  deleteDiningArea();
                }
              }}
            >
              Delete
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
      <ManageDiningTableDialog
        editingDiningTable={diningTable}
        handleClose={() => setEditDialogOpen(false)}
        open={editDialogOpen}
      />
      <DownloadQRDialog
        tableId={diningTable.id}
        open={downloadQrDialogOpen}
        handleClose={() => setDownloadQrDialogOpen(false)}
      />
    </>
  );
};
