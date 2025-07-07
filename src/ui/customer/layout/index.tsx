import type { FC } from "react";
import { Outlet } from "react-router";

export const Customer_Layout: FC = () => {
  return (
    <>
      <header>Header</header>
      <main>
        <Outlet />
      </main>
      <footer>Footer</footer>
    </>
  );
};
