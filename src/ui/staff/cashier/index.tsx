import { Box, Stack, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";
import { InvoiceProvider } from "./shared/invoice-context";
import { CashierSocketProvider } from "./socket-context";

export const Cashier_Root = () => {
  return (
    <CashierSocketProvider>
      <InvoiceProvider>
        <Stack direction={"row"}>
          <Box flex={1}>
            <Outlet />
          </Box>
          <Box
            width={"400px"}
            flexShrink={0}
            borderLeft={1}
            borderColor={"divider"}
            height={"calc(100vh - var(--header-height))"}
            overflow={"auto"}
          >
            <Box p={1} position={"sticky"} top={0} bgcolor={"background.paper"}>
              <Typography
                variant="caption"
                color="textSecondary"
                textTransform={"uppercase"}
              >
                Notifications
              </Typography>
            </Box>
            <Stack direction={"column"} p={2} spacing={1}>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>

              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>

              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
              <Typography variant="body2">New message from John</Typography>
              <Typography variant="body2">
                Server maintenance scheduled
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </InvoiceProvider>
    </CashierSocketProvider>
  );
};
