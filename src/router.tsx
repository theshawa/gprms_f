import { createBrowserRouter } from "react-router";
import { CustomerHomePage } from "./features/customer/home";
import { CustomerLayout } from "./features/customer/layout";
import { ErrorPage } from "./features/error";
import { NotFoundPage } from "./features/not-found";
import { StaffAdminHomePage } from "./features/staff/admin/home";
import { StaffAdminLayout } from "./features/staff/admin/layout";
import { StaffLayout } from "./features/staff/layout";
import { StaffLoginPage } from "./features/staff/login";
import { StaffWaiterHomePage } from "./features/staff/waiter/home";
import { StaffWaiterLayout } from "./features/staff/waiter/layout";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <CustomerHomePage />,
      },
    ],
  },
  {
    path: "/staff",
    element: <StaffLayout />,
    children: [
      {
        path: "login",
        element: <StaffLoginPage />,
      },
      {
        path: "admin",
        element: <StaffAdminLayout />,
        children: [
          {
            index: true,
            element: <StaffAdminHomePage />,
          },
        ],
      },
      {
        path: "waiter",
        element: <StaffWaiterLayout />,
        children: [
          {
            index: true,
            element: <StaffWaiterHomePage />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
