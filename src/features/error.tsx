import { Box, Typography } from "@mui/material";
import type { FC } from "react";
import { useRouteError } from "react-router";

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
      <Typography variant="h1" mb={3}>
        Something went wrong!
      </Typography>
      <Typography variant="caption" mb={2}>
        {error instanceof Error ? error.message : "An unknown error occurred."}
      </Typography>
      <Typography variant="body1" mb={2}>
        Refresh the page or try again later.
      </Typography>
    </Box>
  );
};
