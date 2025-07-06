import type { FC } from "react";
import { Outlet } from "react-router";
import { StaffRole } from "../shared/staff-role.enum";
import { useRedirectIfNotAuthenticated } from "../shared/useRedirectIfNotAuthenticated";

export const StaffKitchenManagerLayout: FC = () => {
  useRedirectIfNotAuthenticated(StaffRole.KitchenManager);

  return <Outlet />;
};
