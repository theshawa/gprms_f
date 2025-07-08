import { AddLocationAlt } from "@mui/icons-material";
import { type FC, useState } from "react";
import { ItemsPageLayout } from "../../shared/items-page-layout";
import { ManageLocationDialog } from "./manage-location-dialog";

export const Admin_ManageLocationsPage: FC = () => {
  const [manageLocationDialogOpen, setManageLocationDialogOpen] =
    useState(false);

  const closeManageLocationDialog = () => {
    setManageLocationDialogOpen(false);
  };
  return (
    <>
      <ItemsPageLayout
        title="Manage Locations"
        subtitle="Organize your restaurant space with different locations like dining areas, patios, and private rooms."
        buttonText="Add New Location"
        buttonIcon={<AddLocationAlt />}
        onButtonClick={() => setManageLocationDialogOpen(true)}
      >
        <div>
          <p>Configure and manage your restaurant locations</p>
        </div>
      </ItemsPageLayout>
      <ManageLocationDialog
        handleClose={closeManageLocationDialog}
        open={manageLocationDialogOpen}
      />
    </>
  );
};
