import { AddLocationAlt } from "@mui/icons-material";
import type { FC } from "react";
import { ItemsPageLayout } from "../../shared/items-page-layout";

export const Admin_ManageLocationsPage: FC = () => {
  return (
    <ItemsPageLayout
      title="Manage Locations"
      subtitle="Organize your restaurant space with different locations like dining areas, patios, and private rooms."
      buttonText="Add New Location"
      buttonIcon={<AddLocationAlt />}
      onButtonClick={() => {}}
    >
      <div>
        <p>Configure and manage your restaurant locations</p>
      </div>
    </ItemsPageLayout>
  );
};
