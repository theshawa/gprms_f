import { DiningAreasService } from "@/services/dining-areas";
import { AddLocationAlt } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { ItemsPageLayout } from "../../shared/items-page-layout";
import { PageError } from "../../shared/page-error";
import { PageLoader } from "../../shared/page-loader";
import { DiningAreaCard } from "./dining-area-card";
import { ManageDininAreaDialog } from "./manage-dining-area-dialog";

export const Admin_ManageDiningAreasPage: FC = () => {
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const {
    data: diningAreas,
    refetch,
    isPending,
    error,
  } = useQuery({
    queryKey: ["admin_manageDiningAreas_home"],
    queryFn: () => DiningAreasService.getAll(),
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
        title="Manage Dining Areas"
        subtitle="Organize your restaurant space with different dining areas."
        buttonText="Add New Dining Area"
        buttonIcon={<AddLocationAlt />}
        onButtonClick={() => setNewDialogOpen(true)}
      >
        <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
          {diningAreas.map((da, i) => (
            <Grid size={1} key={i}>
              <DiningAreaCard
                onDelete={() => {
                  refetch();
                }}
                diningArea={da}
              />
            </Grid>
          ))}
        </Grid>
        {diningAreas.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No dining areas found. Click "Add New Dining Area" to create one.
          </Typography>
        )}
      </ItemsPageLayout>
      <ManageDininAreaDialog
        handleClose={() => setNewDialogOpen(false)}
        open={newDialogOpen}
        onManageSuccess={() => refetch()}
      />
    </>
  );
};
