import { Alert, Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useRouteError } from "react-router-dom";

export const ErrorPage: FC = () => {
  const error = useRouteError();

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
      <Typography variant="h3" mb={3}>
        Something went wrong!
      </Typography>
      <Alert severity="error" sx={{ mb: 2 }}>
        {error instanceof Error ? error.message : "An unknown error occurred."}
      </Alert>
      <Typography variant="body2" mb={2}>
        Refresh the page or try again later.
      </Typography>
    </Box>
  );
};
