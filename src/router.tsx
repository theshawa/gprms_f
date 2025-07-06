import { createBrowserRouter } from "react-router";
import { CustomerHomePage } from "./features/customer/home";
import { CustomerLayout } from "./features/customer/layout";
import { StaffAdminHomePage } from "./features/staff/admin/home";
import { StaffAuthenticatedLayout } from "./features/staff/layout/authenticated";
import { StaffRootLayout } from "./features/staff/layout/root";
import { StaffLoginPage } from "./features/staff/login";

export const router = createBrowserRouter([
  {
    path: "/",
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
    element: <StaffRootLayout />,
    children: [
      {
        path: "login",
        element: <StaffLoginPage />,
      },
      {
        path: "",
        element: <StaffAuthenticatedLayout />,
        children: [
          {
            path: "admin",
            children: [
              {
                index: true,
                element: <StaffAdminHomePage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
