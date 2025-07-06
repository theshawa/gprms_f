import type { FC } from "react";
import { Outlet } from "react-router";

export const CustomerLayout: FC = () => {
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
