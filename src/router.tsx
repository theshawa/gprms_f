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
import { KitchenManagerHomePage } from "./features/staff/kitchen-manager/home";
import { KitchenManagerOrdersPage } from "./features/staff/kitchen-manager/orders";
import { KitchenManagerMealsPage } from "./features/staff/kitchen-manager/meals";
import { MealItem } from "./features/staff/kitchen-manager/shared/meal-item";
import { KitchenManagerIngredientsPage } from "./features/staff/kitchen-manager/ingredients";

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
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
