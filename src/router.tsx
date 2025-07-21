import { StaffAuthGuard } from "@/components/staff-auth-guard";
import { StaffRole } from "@/enums/staff-role";
import { Customer_HomePage } from "@/ui/customer/home";
import { Customer_Layout } from "@/ui/customer/layout";
import { ErrorPage } from "@/ui/error";
import { NotFoundPage } from "@/ui/not-found";
import { Admin_HomePage } from "@/ui/staff/admin/home";
import { Admin_AnalyticsPage } from "@/ui/staff/admin/analytics";
import { Admin_FeedbackPage } from "@/ui/staff/admin/feedback";
import { Admin_StaffPage } from "@/ui/staff/admin/staff";
import { KitchenManager_HomePage } from "@/ui/staff/kitchen-manager/home";
import { KitchenManager_IngredientsPage } from "@/ui/staff/kitchen-manager/ingredients";
import { KitchenManager_MealsPage } from "@/ui/staff/kitchen-manager/meals";
import { KitchenManager_OrdersPage } from "@/ui/staff/kitchen-manager/orders";
import { KitchenManager_MealItem } from "@/ui/staff/kitchen-manager/shared/meal-item";
import { Staff_Layout } from "@/ui/staff/layout";
import { Staff_LoginPage } from "@/ui/staff/login";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Customer_Reservations } from "./ui/customer/reservations";
import { Admin_DiningAreasPage } from "./ui/staff/admin/dining-areas";
import { Admin_DiningTablesPage } from "./ui/staff/admin/dining-tables";
import { Admin_DishesPage } from "./ui/staff/admin/dishes";
import { Admin_IngredientsPage } from "./ui/staff/admin/ingredients";
import { Admin_MenusPage } from "./ui/staff/admin/menus";
import { Admin_ManageOffersHomePage } from "./ui/staff/admin/offers";
import { Admin_OrdersLayout } from "./ui/staff/admin/orders";
import { Admin_OrdersDineInOrders } from "./ui/staff/admin/orders/dine-in-orders";
import { Admin_OrdersTakeAwayOrders } from "./ui/staff/admin/orders/take-away-orders";
import { Admin_ReservationsHomePage } from "./ui/staff/admin/reservations";
import { Cashier_HomePage } from "./ui/staff/cashier/home";
import { Cashier_InvoicesPage } from "./ui/staff/cashier/invoices";
import { Waiter_Root } from "./ui/staff/waiter";
import { Waiter_CustomerFeedbacksPage } from "./ui/staff/waiter/customer-feedbacks";
import { Waiter_HomePage } from "./ui/staff/waiter/home";
import { Waiter_CustomerReservationsPage } from "./ui/staff/waiter/reservations";
import { Cashier_OrdersPage } from "./ui/staff/cashier/orders";
import { Customer_Menu } from "./ui/customer/place-order";
import { Customer_MenuViewOnly } from "./ui/customer/menu";

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
      {
        path: "reservations",
        element: <Customer_Reservations />,
      },
      {
        path: "menu",
        element: <Customer_MenuViewOnly />,
      },
      {
        path: "place-order",
        element: <Customer_Menu />,
      },
    ],
  },
  // Staff routes
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
                <Admin_StaffPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "dining-areas",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_DiningAreasPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "dining-tables",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_DiningTablesPage />
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
            path: "dishes",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_DishesPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "menus",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_MenusPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "ingredients",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_IngredientsPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "analytics",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_AnalyticsPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "feedback",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_FeedbackPage />
              </StaffAuthGuard>
            ),
          },
        ],
      },
      // Waiter routes
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
          {
            path: "customer-feedbacks",
            element: (
              <StaffAuthGuard role={StaffRole.Waiter}>
                <Waiter_CustomerFeedbacksPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "customer-reservations",
            element: (
              <StaffAuthGuard role={StaffRole.Waiter}>
                <Waiter_CustomerReservationsPage />
              </StaffAuthGuard>
            ),
          },
        ],
      },
      
      // Kitchen Manager routes
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
      {
        path: "cashier",
        children: [
          {
            index: true,
            element: (
              <StaffAuthGuard role={StaffRole.Cashier}>
                <Cashier_HomePage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "invoices",
            element: (
              <StaffAuthGuard role={StaffRole.Cashier}>
                <Cashier_InvoicesPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "orders",
            element: (
              <StaffAuthGuard role={StaffRole.Cashier}>
                <Cashier_OrdersPage />
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
