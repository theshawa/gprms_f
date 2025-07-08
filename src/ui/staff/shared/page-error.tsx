import { getBackendErrorMessage } from "@/backend";
import { Alert, Box } from "@mui/material";
import type { FC } from "react";

export const PageError: FC<{ error: any }> = ({ error }) => {
  return (
    <Box p={3}>
      <Alert severity="error">
        Failed to load staff accounts: {getBackendErrorMessage(error)}
      </Alert>
    </Box>
  );
};
