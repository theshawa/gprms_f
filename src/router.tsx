import { StaffAuthGuard } from "@/components/staff-auth-guard";
import { StaffRole } from "@/enums/staff-role";
import { Customer_HomePage } from "@/ui/customer/home";
import { Customer_Layout } from "@/ui/customer/layout";
import { ErrorPage } from "@/ui/error";
import { NotFoundPage } from "@/ui/not-found";
import { Admin_HomePage } from "@/ui/staff/admin/home";
import { Admin_ManageStaffPage } from "@/ui/staff/admin/staff";
import { KitchenManager_HomePage } from "@/ui/staff/kitchen-manager/home";
import { KitchenManager_IngredientsPage } from "@/ui/staff/kitchen-manager/ingredients";
import { KitchenManager_MealsPage } from "@/ui/staff/kitchen-manager/meals";
import { KitchenManager_OrdersPage } from "@/ui/staff/kitchen-manager/orders";
import { KitchenManager_MealItem } from "@/ui/staff/kitchen-manager/shared/meal-item";
import { Staff_Layout } from "@/ui/staff/layout";
import { Staff_LoginPage } from "@/ui/staff/login";
import { Waiter_HomePage } from "@/ui/staff/waiter/home";
import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <Customer_Layout />,
    children: [
      {
        index: true,
        element: <Customer_HomePage />,
      },
    ],
  },
  {
    path: "/staff",
    element: <Staff_Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/staff/login" replace />,
      },
      {
        path: "login",
        element: <Staff_LoginPage />,
      },
      {
        path: "admin",
        children: [
          {
            index: true,
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_HomePage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "staff",
            children: [
              {
                index: true,
                element: (
                  <StaffAuthGuard role={StaffRole.Admin}>
                    <Admin_ManageStaffPage />
                  </StaffAuthGuard>
                ),
              },
            ],
          },
        ],
      },
      {
        path: "waiter",
        children: [
          {
            index: true,
            element: (
              <StaffAuthGuard role={StaffRole.Waiter}>
                <Waiter_HomePage />
              </StaffAuthGuard>
            ),
          },
        ],
      },
      {
        path: "kitchen-manager",
        children: [
          {
            index: true,
            element: (
              <StaffAuthGuard role={StaffRole.KitchenManager}>
                <KitchenManager_HomePage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "orders",
            element: (
              <StaffAuthGuard role={StaffRole.KitchenManager}>
                <KitchenManager_OrdersPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "meals",
            children: [
              {
                index: true,
                element: (
                  <StaffAuthGuard role={StaffRole.KitchenManager}>
                    <KitchenManager_MealsPage />
                  </StaffAuthGuard>
                ),
              },
              {
                path: "meal-item/:mealId",
                element: (
                  <StaffAuthGuard role={StaffRole.KitchenManager}>
                    <KitchenManager_MealItem />
                  </StaffAuthGuard>
                ),
              },
            ],
          },
          {
            path: "ingredients",
            element: (
              <StaffAuthGuard role={StaffRole.KitchenManager}>
                <KitchenManager_IngredientsPage />
              </StaffAuthGuard>
            ),
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
