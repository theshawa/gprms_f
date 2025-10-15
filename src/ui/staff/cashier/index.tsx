import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import { Notifications } from "./notifications";
import { SocketProvider } from "./socket-context";

export const Cashier_Root = () => {
  return (
    <SocketProvider>
      <Stack direction={"row"} overflow={"hidden"} className="h-[calc(100vh-var(--header-height))]">
        <Stack flex={1}>
          <Outlet />
        </Stack>
        <Notifications />
      </Stack>
    </SocketProvider>
  );
};
