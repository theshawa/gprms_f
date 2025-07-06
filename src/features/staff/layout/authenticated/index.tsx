import { Box } from "@mui/material";
import { useAtom } from "jotai";
import { type FC } from "react";
import { Navigate, Outlet } from "react-router";
import { staffAuthAtom } from "../../auth/atom";
import { Header } from "./header";

export const StaffAuthenticatedLayout: FC = () => {
  const [auth] = useAtom(staffAuthAtom);

  if (!auth) {
    return <Navigate to="/staff/login" replace />;
  }

  return (
    <>
      <Header />
      <Box p={3}>
        <Outlet />
      </Box>
      <Box p={3}>Footer</Box>
    </>
  );
};
