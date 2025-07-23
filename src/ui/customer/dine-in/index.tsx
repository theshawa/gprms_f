import type { DiningTable } from "@/interfaces/dining-table";
import type { Menu } from "@/interfaces/menu";
import { PageLoader } from "@/ui/staff/shared/page-loader";
import { Alert } from "@mui/material";
import { type FC, useEffect, useState } from "react";
import { Outlet, useParams } from "react-router-dom";
import { type Socket, io } from "socket.io-client";
import { Customer_DineInContext } from "./context";
import { DineInStatus } from "./dine-in-status";

export const Customer_DineInLayout: FC = () => {
  const tableId = useParams<{ tableId: string }>().tableId!;

  const [data, setData] = useState<
    { diningTable: DiningTable; menu: Menu } | undefined
  >();
  const [socket, setSocket] = useState<Socket | undefined>();

  const [isPending, setIsPending] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const newSocket = io("http://localhost:5000/customer-dine-in", {
      query: { tableId, time: Date.now() },
    });

    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("Connected to customer socket");
    });

    newSocket.on("disconnect", () => {
      console.log("Disconnected from customer socket");
    });

    newSocket.emit("init");

    newSocket.on("initResponse", (data) => {
      setIsPending(false);
      setData(data);
    });

    newSocket.on("initError", (error: any) => {
      setIsPending(false);
      setError(error);
    });

    return () => {
      newSocket.disconnect();
    };
  }, [tableId]);

  if (isPending) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <PageLoader />
      </main>
    );
  }

  if (error) {
    return (
      <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Alert color="error">Failed to start order: {error}</Alert>
      </main>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Customer_DineInContext.Provider value={{ ...data, socket }}>
        <DineInStatus />
        <Outlet />
      </Customer_DineInContext.Provider>
    </main>
  );
};
