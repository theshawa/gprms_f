import { Box } from "@mui/material";
import type { FC } from "react";
import { Outlet } from "react-router";
import { Header } from "./header";

export const StaffLayout: FC = () => {
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
