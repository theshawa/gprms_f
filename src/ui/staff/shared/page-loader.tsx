import { Box, LinearProgress } from "@mui/material";
import type { FC } from "react";

export const PageLoader: FC = () => {
  return (
    <div className="min-h-72 flex items-center justify-center">
      <Box sx={{ width: "100%", maxWidth: "10rem" }}>
        <LinearProgress />
      </Box>
    </div>
  );
};
