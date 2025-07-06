import { createBrowserRouter } from "react-router";
import { KitchenManagerHomePage } from "./pages/staff/kitchen-manager/home";
import { KitchenManagerOrdersPage } from "./pages/staff/kitchen-manager/orders";
import { KitchenManagerMealsPage } from "./pages/staff/kitchen-manager/meals";
import { MealItem } from "./pages/staff/kitchen-manager/shared/meal-item";
import { KitchenManagerIngredientsPage } from "./pages/staff/kitchen-manager/ingredients";
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
          {
            path: "kitchen-manager",
            children: [
              {
                index: true,
                element: <KitchenManagerHomePage />,
              },
              {
                path: "orders",
                element: <KitchenManagerOrdersPage />,
              },
              {
                path: "meals",
                children: [
                  {
                    index: true,
                    element: <KitchenManagerMealsPage />,
                  },
                  {
                    path: "meal-item/:mealId",
                    element: <MealItem />,
                  },
                ],
              },
              {
                path: "ingredients",
                element: <KitchenManagerIngredientsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
]);
