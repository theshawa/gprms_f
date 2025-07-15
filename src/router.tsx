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
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Admin_ManageDiningAreasPage } from "./ui/staff/admin/dining-areas";
import { Admin_ManageDiningTablesPage } from "./ui/staff/admin/dining-tables";
import { Admin_ManangeIngredientsHomePage } from "./ui/staff/admin/ingredients";
import { Admin_ManangeMealsHomePage } from "./ui/staff/admin/meals";
import { Admin_ManageOffersHomePage } from "./ui/staff/admin/offers";
import { Admin_OrdersLayout } from "./ui/staff/admin/orders";
import { Admin_OrdersDineInOrders } from "./ui/staff/admin/orders/dine-in-orders";
import { Admin_OrdersTakeAwayOrders } from "./ui/staff/admin/orders/take-away-orders";
import { Admin_ReservationsHomePage } from "./ui/staff/admin/reservations";
import { Waiter_Root } from "./ui/staff/waiter";
import { Waiter_HomePage } from "./ui/staff/waiter/home";

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
    errorElement: <ErrorPage />,
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
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_ManageStaffPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "dining-areas",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_ManageDiningAreasPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "dining-tables",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_ManageDiningTablesPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "offers",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_ManageOffersHomePage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "orders",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_OrdersLayout />
              </StaffAuthGuard>
            ),
            children: [
              {
                index: true,
                element: <Admin_OrdersDineInOrders />,
              },
              {
                path: "take-away",
                element: <Admin_OrdersTakeAwayOrders />,
              },
            ],
          },
          {
            path: "reservations",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_ReservationsHomePage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "meals",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_ManangeMealsHomePage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "ingredients",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_ManangeIngredientsHomePage />
              </StaffAuthGuard>
            ),
          },
        ],
      },
      {
        path: "waiter",
        element: <Waiter_Root />,
        children: [
          {
            index: true,
            element: (
              <StaffAuthGuard role={StaffRole.Waiter}>
                <Waiter_HomePage />
              </StaffAuthGuard>
            ),
          },
          // {
          //   path: "table/:tableId",
          //   element: (
          //     <StaffAuthGuard role={StaffRole.Waiter}>
          //       <Waiter_TableDetailsPage />
          //     </StaffAuthGuard>
          //   ),
          // },
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
