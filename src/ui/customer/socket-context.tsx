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

export const SocketProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io("http://localhost:5000/customer-dine-in");

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to customer socket");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from customer socket");
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocketConnection = () => useContext(SocketContext);
