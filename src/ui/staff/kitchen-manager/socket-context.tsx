import { useStaffAuth } from "@/hooks/useStaffAuth";
import { type FC, type ReactNode, createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | undefined>(undefined);

export const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();
  const { auth } = useStaffAuth();

  useEffect(() => {
    if (!auth) return;

    const newSocket = io("http://localhost:5000/kitchen-manager", {
      auth: {
        token: auth.accessToken,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to kitchen manager socket");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from kitchen manager socket");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [auth]);

  return <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>;
};

export const useSocketConnection = () => useContext(SocketContext);
