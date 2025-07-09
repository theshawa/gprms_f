import { LocationsService } from "@/services/locations";
import { AddLocationAlt } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { ItemsPageLayout } from "../../shared/items-page-layout";
import { PageError } from "../../shared/page-error";
import { PageLoader } from "../../shared/page-loader";
import { LocationCard } from "./location-card";
import { ManageLocationDialog } from "./manage-location-dialog";

export const Admin_ManageLocationsPage: FC = () => {
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const {
    data: locations,
    refetch,
    isPending,
    error,
  } = useQuery({
    queryKey: ["admin_manageLocations_home"],
    queryFn: () => LocationsService.getLocations(),
  });

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError error={error} />;
  }

  return (
    <>
      <ItemsPageLayout
        title="Manage Locations"
        subtitle="Organize your restaurant space with different locations like dining areas, patios, and private rooms."
        buttonText="Add New Location"
        buttonIcon={<AddLocationAlt />}
        onButtonClick={() => setNewDialogOpen(true)}
      >
        <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
          {locations.map((location, i) => (
            <Grid size={1} key={i}>
              <LocationCard
                onDelete={() => {
                  refetch();
                }}
                location={location}
              />
            </Grid>
          ))}
        </Grid>
        {locations.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No locations found. Click "Add New Location" to create one.
          </Typography>
        )}
      </ItemsPageLayout>
      <ManageLocationDialog
        handleClose={() => setNewDialogOpen(false)}
        open={newDialogOpen}
        onManageSuccess={() => refetch()}
      />
    </>
  );
};
