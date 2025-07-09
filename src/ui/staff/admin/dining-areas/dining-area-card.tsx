import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import type { DiningArea } from "@/interfaces/dining-area";
import { DiningAreasService } from "@/services/dining-areas";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { ManageDininAreaDialog } from "./manage-dining-area-dialog";

export const DiningAreaCard: FC<{
  diningArea: DiningArea;
  onDelete: () => void;
}> = ({ diningArea: initialDiningArea, onDelete }) => {
  const [diningArea, seDiningArea] = useState<DiningArea>(initialDiningArea);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { showError, showSuccess } = useAlert();

  const { confirm } = useConfirmation();

  const { mutate: deleteDiningArea, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => DiningAreasService.delete(id),
    mutationKey: ["admin_manageDiningArea_deleteDiningArea"],
    onSuccess: () => {
      onDelete();
      showSuccess("Dining area deleted successfully.");
    },
    onError: (err) => {
      showError(`Failed to delete dining area: ${getBackendErrorMessage(err)}`);
    },
  });

  return (
    <>
      <Card>
        <CardMedia
          sx={{ height: 140 }}
          image="/dining-area-example.jpg"
          title={`${diningArea.name} image`}
        />
        <CardContent>
          <Typography gutterBottom variant="h6">
            {diningArea.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {diningArea.description || "No description provided."}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            size="small"
            onClick={() => {
              setEditDialogOpen(true);
            }}
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
                  title: "Are you sure?",
                  message: `You are going to delete the dining area '${diningArea.name}'. This action cannot be undone.`,
                  confirmButtonDanger: true,
                  confirmText: "Yes, Delete",
                })
              ) {
                deleteDiningArea(diningArea.id);
              }
            }}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
      <ManageDininAreaDialog
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        editingDiningArea={diningArea}
        onManageSuccess={(v) => seDiningArea((pda) => ({ ...pda, ...v }))}
      />
    </>
  );
};
