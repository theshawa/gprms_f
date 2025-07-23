import { Box, Button, Stack, Typography } from "@mui/material";
import type { FC, ReactNode } from "react";

export const PageLayout: FC<{
  title: string;
  subtitle: string;
  button?:
    | {
        text: string;
        icon: ReactNode;
        onClick: () => void;
        variant?: "contained" | "outlined" | "text";
      }
    | {
        text: string;
        icon: ReactNode;
        onClick: () => void;
        variant?: "contained" | "outlined" | "text";
      }[];
  children: ReactNode;
  noMargin?: boolean;
}> = ({ button, children, subtitle, title, noMargin }) => {
  return (
    <Box p={3}>
      <Stack
        direction={{ xm: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: "start",
        }}
        mb={noMargin ? 2 : 5}
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

        {button && (
          <Stack direction="row" spacing={1}>
            {Array.isArray(button) ? (
              button.map((b, i) => (
                <Button
                  key={i}
                  startIcon={b.icon}
                  onClick={b.onClick}
                  variant={b.variant || "contained"}
                >
                  {b.text}
                </Button>
              ))
            ) : (
              <Button
                startIcon={button.icon}
                onClick={button.onClick}
                variant={button.variant || "contained"}
              >
                {button.text}
              </Button>
            )}
          </Stack>
        )}
      </Stack>
      {children}
    </Box>
  );
};
