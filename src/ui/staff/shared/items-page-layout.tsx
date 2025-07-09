import { Box, Button, Typography } from "@mui/material";
import type { FC, ReactNode } from "react";

export const ItemsPageLayout: FC<{
  title: string;
  subtitle: string;
  buttonText: string;
  onButtonClick: () => void;
  children: ReactNode;
  buttonIcon?: ReactNode;
}> = ({ buttonText, buttonIcon, children, onButtonClick, subtitle, title }) => {
  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        flexDirection={{ xs: "column", sm: "row" }}
        alignItems="start"
        mb={5}
      >
        <Box mb={{ xs: 2, sm: 0 }}>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            maxWidth="50rem"
          >
            {subtitle}
          </Typography>
        </Box>
        <Button
          onClick={onButtonClick}
          variant="contained"
          color="primary"
          startIcon={buttonIcon}
        >
          {buttonText}
        </Button>
      </Box>
      {children}
    </Box>
  );
};
