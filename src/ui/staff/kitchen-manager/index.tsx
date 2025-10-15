import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { SocketProvider } from "./socket-context";

export const KitchenManager_Root: FC = () => {
  return (
    <SocketProvider>
      <Outlet />
    </SocketProvider>
  );
};
