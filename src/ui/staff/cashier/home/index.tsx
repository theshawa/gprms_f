import { staffBackend } from "@/backend";
import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import { useEffect, useState } from "react";

export const Cashier_HomePage: FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatSriLankaDateTime = (date: Date) => {
    return date.toLocaleString("en-US", {
      timeZone: "Asia/Colombo",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const loadActivities = async () => {
    const res = await staffBackend.get("/cashier/activity-logs/1");
    console.log(res.data);
  };

  return (
    <Box sx={{ p: 3, position: "relative", minHeight: "100vh" }}>
      {/* Sri Lanka Date and Time - Top Right */}
      <Box
        sx={{
          position: "absolute",
          top: 16,
          right: 16,
          textAlign: "right",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 400 }}>
          {formatSriLankaDateTime(currentTime)}
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ mt: 8 }}>
        <Button onClick={loadActivities} variant="contained">
          Hello Cashier
        </Button>
      </Box>
    </Box>
  );
};
