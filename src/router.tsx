import { createBrowserRouter } from "react-router";
import { CustomerHomePage } from "./pages/customer/home";
import { CustomerLayout } from "./pages/customer/layout";
import { StaffAdminHomePage } from "./pages/staff/admin/home";
import { StaffLayout } from "./pages/staff/layout";
import { StaffLoginPage } from "./pages/staff/login";
import { KitchenManagerHomePage } from "./pages/staff/kitchen-manager/home";
import { KitchenManagerOrdersPage } from "./pages/staff/kitchen-manager/orders";
import { KitchenManagerMealsPage } from "./pages/staff/kitchen-manager/meals";
import { MealItem } from "./pages/staff/kitchen-manager/shared/meal-item";
import { KitchenManagerIngredientsPage } from "./pages/staff/kitchen-manager/ingredients";

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
