import { useStaffAuth } from "@/hooks/useStaffAuth";
import {
  type FC,
  type ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | undefined>(undefined);

export const CashierSocketProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket>();
  const { auth } = useStaffAuth();

  useEffect(() => {
    if (!auth) return;

    const newSocket = io("http://localhost:5000/cashier", {
      auth: {
        token: auth.accessToken,
      },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to cashier socket");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from cashier socket");
    });

    return () => {
      newSocket.disconnect();
    };
  }, [auth]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useCashierSocketConnection = () => useContext(SocketContext);
