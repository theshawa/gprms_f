import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import type { Location } from "@/interfaces/location";
import { LocationsService } from "@/services/locations";
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
import { ManageLocationDialog } from "./manage-location-dialog";

export const LocationCard: FC<{ location: Location; onDelete: () => void }> = ({
  location: initialLocation,
  onDelete,
}) => {
  const [location, setLocation] = useState<Location>(initialLocation);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { showError, showSuccess } = useAlert();

  const { confirm } = useConfirmation();

  const { mutate: deleteLocation, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => LocationsService.deleteLocation(id),
    mutationKey: ["admin_manageLocation_deleteLocation"],
    onSuccess: () => {
      onDelete();
      showSuccess("Location deleted successfully.");
    },
    onError: (err) => {
      showError(`Failed to delete location: ${getBackendErrorMessage(err)}`);
    },
  });

  return (
    <>
      <Card>
        <CardMedia
          sx={{ height: 140 }}
          image="/location-example.jpg"
          title={`${location.name} image`}
        />
        <CardContent>
          <Typography gutterBottom variant="h6">
            {location.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {location.description || "No description provided."}
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
                  message: `You are going to delete the location '${location.name}'. This action cannot be undone.`,
                  confirmButtonDanger: true,
                  confirmText: "Yes, Delete",
                })
              ) {
                deleteLocation(location.id);
              }
            }}
          >
            Delete
          </Button>
        </CardActions>
      </Card>
      <ManageLocationDialog
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        editingLocation={location}
        onManageSuccess={(v) => setLocation((pl) => ({ ...pl, ...v }))}
      />
    </>
  );
};
