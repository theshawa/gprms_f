import { Button } from "@mui/material";
import type { FC } from "react";
import { staffBackend } from "../../../../backend";

export const StaffAdminHomePage: FC = () => {
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
