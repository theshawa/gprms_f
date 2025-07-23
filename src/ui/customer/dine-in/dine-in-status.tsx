import { useAlert } from "@/hooks/useAlert";
import { useSocketConnection } from "@/ui/staff/waiter/socket-context";
import { Info } from "@mui/icons-material";
import { Alert } from "@mui/material";
import { useEffect, useState } from "react";

export const DineInStatus = () => {
  const socket = useSocketConnection();
  const [ongoing, setOngoing] = useState(false);

  const { showError } = useAlert();

  useEffect(() => {
    if (!socket) return;

    socket.on("waiterAccepted", (status: boolean) => {
      console.log("Waiter accepted status:", status);
      setOngoing(status);
    });

    socket.on("waiterAcceptedError", (err) => {
      showError(`Failed to fetch dine-in status: ${err}`);
    });

    return () => {
      socket.off("waiterAccepted");
      socket.off("waiterAcceptedError");
    };
  }, [socket]);

  if (ongoing) {
    return null;
  }

  return (
    <Alert color="warning" icon={<Info />} sx={{ mb: 4 }}>
      A waiter will be assigned to your table shortly. Please wait.
    </Alert>
  );
};
