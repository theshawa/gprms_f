import { createBrowserRouter } from "react-router";
import { CustomerHomePage } from "./pages/customer/home";
import { CustomerLayout } from "./pages/customer/layout";
import { StaffAdminHomePage } from "./pages/staff/admin/home";
import { StaffLayout } from "./pages/staff/layout";
import { StaffLoginPage } from "./pages/staff/login";

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
    children: [
      {
        path: "login",
        element: <StaffLoginPage />,
      },
      {
        path: "",
        element: <StaffLayout />,
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
