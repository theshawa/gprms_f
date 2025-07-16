import { staffBackend } from "@/backend";
import { Button } from "@mui/material";
import type { FC } from "react";

export const Cashier_HomePage: FC = () => {
  const loadActivities = async () => {
    const res = await staffBackend.get("/cashier/activity-logs/1");
    console.log(res.data);
  };
  return (
    <>
      <Button onClick={loadActivities} variant="contained">
        Hello Cashier
      </Button>
    </>
  );
};
