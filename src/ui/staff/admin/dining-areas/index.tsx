import { DiningAreasService } from "@/services/dining-areas";
import { AddLocationAlt } from "@mui/icons-material";
import { Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { QKs } from "../../query-keys";
import { PageError } from "../../shared/page-error";
import { PageLayout } from "../../shared/page-layout";
import { PageLoader } from "../../shared/page-loader";
import { DiningAreaCard } from "./dining-area-card";
import { ManageDiningAreaDialog } from "./manage-dining-area-dialog";

export const Admin_DiningAreasPage: FC = () => {
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const {
    data: diningAreas,
    isPending,
    error,
  } = useQuery({
    queryKey: QKs.admin_diningAreas,
    queryFn: () => DiningAreasService.getAll(),
  });

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="dining areas list" error={error} />;
  }

  return (
    <>
      <PageLayout
        title="Dining Areas"
        subtitle="Organize your restaurant space with different dining areas."
        button={{
          text: "New Dining Area",
          icon: <AddLocationAlt />,
          onClick: () => setNewDialogOpen(true),
        }}
      >
        <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
          {diningAreas.map((da) => (
            <Grid size={1} key={da.id}>
              <DiningAreaCard diningArea={da} />
            </Grid>
          ))}
        </Grid>
        {diningAreas.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No dining areas found. Click "New Dining Area" to create one.
          </Typography>
        )}
      </PageLayout>
      <ManageDiningAreaDialog
        handleClose={() => setNewDialogOpen(false)}
        open={newDialogOpen}
      />
    </>
  );
};
