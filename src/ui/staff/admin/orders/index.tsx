import { Tab, Tabs } from "@mui/material";
import { type FC } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { PageLayout } from "../../shared/page-layout";

export const Admin_OrdersLayout: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <>
      <PageLayout
        title="Orders"
        subtitle="Manage dine-in and take-away orders"
        noMargin
      >
        <Tabs
          variant="standard"
          onChange={(_, v) => {
            if (v === "take-away") navigate("/staff/admin/orders/take-away");
            else navigate(`/staff/admin/orders`);
          }}
          value={
            location.pathname.endsWith("take-away") ? "take-away" : "dine-in"
          }
          sx={{ mb: 3 }}
        >
          <Tab label="Dine In" value="dine-in" />
          <Tab label="Take Away" value="take-away" />
        </Tabs>
        <Outlet />
      </PageLayout>
    </>
  );
};
