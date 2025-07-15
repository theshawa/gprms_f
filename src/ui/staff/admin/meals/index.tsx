import { Fastfood } from "@mui/icons-material";
import { type FC, useState } from "react";
import { PageLayout } from "../../shared/page-layout";

export const Admin_ManangeMealsHomePage: FC = () => {
  const [newDialogOpen, setNewDialogOpen] = useState(false);
  return (
    <PageLayout
      title="Meals"
      subtitle="View and manage meals"
      button={{
        text: "New Meal",
        onClick: () => setNewDialogOpen(true),
        icon: <Fastfood />,
      }}
    >
      Meals
    </PageLayout>
  );
};
