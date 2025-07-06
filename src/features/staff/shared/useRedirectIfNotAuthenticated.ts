import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useStaffAuthState } from "./staff-auth.state";
import type { StaffRole } from "./staff-role.enum";

export const useRedirectIfNotAuthenticated = (role: StaffRole) => {
  const navigate = useNavigate();
  const { auth } = useStaffAuthState();

  useEffect(() => {
    console.log(auth);

    if (auth?.user.role !== role) {
      navigate("/staff/login", { replace: true });
    }
  }, [auth]);
};
