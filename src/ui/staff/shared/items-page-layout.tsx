import { Box, Button, Stack, Typography } from "@mui/material";
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
      <Stack
        direction={{ xm: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: "start",
        }}
        mb={5}
      >
        <Stack mb={{ xs: 2, sm: 0 }}>
          <Typography variant="h5" gutterBottom>
            {title}
          </Typography>
          <Typography
            variant="subtitle1"
            color="textSecondary"
            maxWidth="30rem"
          >
            {subtitle}
          </Typography>
        </Stack>
        <Button
          onClick={onButtonClick}
          variant="contained"
          color="primary"
          startIcon={buttonIcon}
        >
          {buttonText}
        </Button>
      </Stack>
      {children}
    </Box>
  );
};
