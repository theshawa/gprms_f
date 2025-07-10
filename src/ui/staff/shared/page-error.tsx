import { getBackendErrorMessage } from "@/backend";
import { Alert, Box } from "@mui/material";
import type { FC } from "react";

export const PageError: FC<{ title?: string; error: any }> = ({
  title,
  error,
}) => {
  return (
    <Box p={3}>
      <Alert severity="error">
        Failed to load {title ?? "page data"}: {getBackendErrorMessage(error)}
      </Alert>
    </Box>
  );
};
