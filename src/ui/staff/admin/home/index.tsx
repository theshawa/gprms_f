import { staffBackend } from "@/backend";
import { Button } from "@mui/material";
import type { FC } from "react";

export const Admin_HomePage: FC = () => {
  const loadActivities = async () => {
    const res = await staffBackend.get("/admin/activity-logs/1");
    console.log(res.data);
  };
  return (
    <>
      <Button onClick={loadActivities} variant="contained">
        Hello
      </Button>
    </>
  );
};
