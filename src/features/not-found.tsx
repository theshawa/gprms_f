import { Box, Button, Typography } from "@mui/material";
import type { FC } from "react";
import { Link, useNavigate } from "react-router";
import { useAlert } from "../alert";
import { getBackendErrorMessage } from "../backend";
import { useStaffAuthState } from "./staff/shared/staff-auth.state";
import { StaffService } from "./staff/shared/staff.service";

export const NotFoundPage: FC = () => {
  const { setAuth } = useStaffAuthState();
  const navigate = useNavigate();
  const { showError } = useAlert();

  const logout = async () => {
    try {
      await StaffService.logout();
      setAuth(null);
      navigate("/staff/login", { replace: true });
    } catch (error) {
      showError(getBackendErrorMessage(error));
    }
  };

  return (
    <Box
      p={2}
      textAlign="center"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h5" mb={3}>
        Oops, Page not found!
      </Typography>
      <Link to="/">
        <Button variant="contained">Go to Home</Button>
      </Link>
      <Button onClick={logout}>Logout</Button>
    </Box>
  );
};
