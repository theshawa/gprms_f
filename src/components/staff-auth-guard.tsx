import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { StaffRole } from "../enums/staff-role";
import { useStaffAuth } from "../hooks/useStaffAuth";

export const StaffAuthGuard: FC<{ role: StaffRole; children: ReactNode }> = ({
  role,
  children,
}) => {
  const { auth } = useStaffAuth();

  if (auth?.user.role !== role) {
    return <Navigate to="/staff/login" />;
  }

  return children;
};
