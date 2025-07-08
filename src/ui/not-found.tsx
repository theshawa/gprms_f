import { getBackendErrorMessage } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { StaffService } from "@/services/staff";
import { Box, Button, Typography } from "@mui/material";
import type { FC } from "react";
import { Link, useNavigate } from "react-router-dom";

export const NotFoundPage: FC = () => {
  const { auth, setAuth } = useStaffAuth();
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
      <Box display="flex" gap={2}>
        <Link to="/">
          <Button variant="contained">Go to Home</Button>
        </Link>
        {auth && <Button onClick={logout}>Logout</Button>}
      </Box>
    </Box>
  );
};
