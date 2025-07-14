import { LocalOfferSharp } from "@mui/icons-material";
import { type FC, useState } from "react";
import { PageLayout } from "../../shared/page-layout";

export const Admin_ManageOffersHomePage: FC = () => {
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  return (
    <>
      <PageLayout
        title="Offers"
        subtitle="Organize your restaurant space with different dining areas."
        button={{
          text: "New Offer",
          icon: <LocalOfferSharp />,
          onClick: () => setNewDialogOpen(true),
        }}
      >
        ss
      </PageLayout>
    </>
  );
};
