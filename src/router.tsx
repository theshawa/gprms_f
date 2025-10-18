import { StaffAuthGuard } from "@/components/staff-auth-guard";
import { StaffRole } from "@/enums/staff-role";
import { Customer_DishDetailPage } from "@/ui/customer/dish-detail";
import { Customer_HomePage } from "@/ui/customer/home";
import { Customer_Layout } from "@/ui/customer/layout";
import { ErrorPage } from "@/ui/error";
import { NotFoundPage } from "@/ui/not-found";
import { Admin_AnalyticsPage } from "@/ui/staff/admin/analytics";
import { Admin_FeedbackPage } from "@/ui/staff/admin/feedback";
import { Admin_HomePage } from "@/ui/staff/admin/home";
import { Admin_StaffPage } from "@/ui/staff/admin/staff";
import { KitchenManager_HomePage } from "@/ui/staff/kitchen-manager/home";
import { KitchenManager_IngredientsPage } from "@/ui/staff/kitchen-manager/ingredients";
import { KitchenManager_OrdersPage } from "@/ui/staff/kitchen-manager/orders";
import { Staff_Layout } from "@/ui/staff/layout";
import { Staff_LoginPage } from "@/ui/staff/login";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Customer_DineInLayout } from "./ui/customer/dine-in";
import { Customer_DineInConfirm } from "./ui/customer/dine-in/confirm";
import { Customer_DineInMenuPage } from "./ui/customer/dine-in/menu";
import { Customer_DineInStatusPage } from "./ui/customer/dine-in/status";
import { Customer_MenuViewOnly } from "./ui/customer/menu";
// import { Customer_Menu } from "./ui/customer/place-order";
import { Customer_AboutPage } from "./ui/customer/about-us";
import { Customer_ContactPage } from "./ui/customer/contact";
import { Customer_DiningAreasPage } from "./ui/customer/dining-areas";
import { Customer_FeedbackPage } from "./ui/customer/feedback";
import { Customer_LoginPage } from "./ui/customer/login";
import { Customer_OrderSuccessPage } from "./ui/customer/order-success";
import { Customer_Reservations } from "./ui/customer/reservations";
import { Customer_CartPage } from "./ui/customer/shopping-cart";
import { Customer_TakeAway } from "./ui/customer/takeaway";
import { Customer_TakeAway_CartPage } from "./ui/customer/takeaway/cart";
import { Customer_HomePage as Customer_ViewMenuPage } from "./ui/customer/view-menu";
import { Admin_CalenderPage } from "./ui/staff/admin/calender";
import { Admin_CustomerPage } from "./ui/staff/admin/customers";
import { Admin_DiningAreasPage } from "./ui/staff/admin/dining-areas";
import { Admin_DiningTablesPage } from "./ui/staff/admin/dining-tables";
import { Admin_DishesPage } from "./ui/staff/admin/dishes";
import { Admin_IngredientsPage } from "./ui/staff/admin/ingredients";
import { Admin_MenusPage } from "./ui/staff/admin/menus";
import { Admin_ManageOffersHomePage } from "./ui/staff/admin/offers";
import { Admin_OrdersLayout } from "./ui/staff/admin/orders";
import { Admin_OrdersDineInOrders } from "./ui/staff/admin/orders/dine-in-orders";
import { Admin_OrdersTakeAwayOrders } from "./ui/staff/admin/orders/take-away-orders";
import { Admin_PayrollPage } from "./ui/staff/admin/payroll";
import { Admin_PayrollConfigsPage } from "./ui/staff/admin/payroll/configs";
import { Admin_ReservationsHomePage } from "./ui/staff/admin/reservations";
import { Cashier_Root } from "./ui/staff/cashier";
import { Cashier_HomePage } from "./ui/staff/cashier/home";
import { Staff_PayrollPage } from "./ui/staff/common/payroll";
import { KitchenManager_Root } from "./ui/staff/kitchen-manager";
import { KitchenManager_DishesPage } from "./ui/staff/kitchen-manager/dishes";
import { Waiter_Root } from "./ui/staff/waiter";
import { Waiter_CustomerFeedbacksPage } from "./ui/staff/waiter/customer-feedbacks";
import { Waiter_HomePage } from "./ui/staff/waiter/home";
import { Waiter_CustomerReservationsPage } from "./ui/staff/waiter/reservations";

export const router = createBrowserRouter([
  // Customer login as a top-level page (no layout/header/footer)
  {
    path: "/customer/login",
    element: <Customer_LoginPage />,
    errorElement: <ErrorPage />,
  },
  // Order summary page - shows current order status and allows more ordering rounds
  {
    path: "/order-summary",
    element: <Customer_MenuViewOnly />,
    errorElement: <ErrorPage />,
  },
  // Individual dish details page
  {
    path: "/dish/:dishId",
    element: <Customer_DishDetailPage />,
    errorElement: <ErrorPage />,
  },
  // View menu page - dine-in experience after login (no layout/header/footer)
  {
    path: "/view-menu",
    element: <Customer_ViewMenuPage />,
    errorElement: <ErrorPage />,
  },
  // Cart page - view and manage cart items
  {
    path: "/cart",
    element: <Customer_CartPage />,
    errorElement: <ErrorPage />,
  },
  // Order success page
  {
    path: "/order-success",
    element: <Customer_OrderSuccessPage />,
    errorElement: <ErrorPage />,
  },
  // Feedback page
  {
    path: "/feedback",
    element: <Customer_FeedbackPage />,
    errorElement: <ErrorPage />,
  },
  // Place order page as a top-level page (no layout/header/footer) - mobile/tablet focused
  // {
  //   path: "/place-order",
  //   element: <Customer_Menu />,
  //   errorElement: <ErrorPage />,
  // },
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
        path: "dish/:dishId",
        element: <Customer_DishDetailPage />,
      },
      {
        path: "dine-in/:tableId",
        element: <Customer_DineInLayout />,
        children: [
          {
            index: true,
            element: <Customer_DineInMenuPage />,
          },
          {
            path: "confirm",
            element: <Customer_DineInConfirm />,
          },
          {
            path: "status",
            element: <Customer_DineInStatusPage />,
          },
        ],
      },
      {
        path: "takeaway",
        children: [
          { index: true, element: <Customer_TakeAway /> },
          {
            path: "cart",
            element: <Customer_TakeAway_CartPage />,
          },
        ],
      },
      {
        path: "our-story",
        element: <Customer_AboutPage />,
      },
      {
        path: "dining-areas",
        element: <Customer_DiningAreasPage />,
      },
      {
        path: "contact",
        element: <Customer_ContactPage />,
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
            path: "customers",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_CustomerPage />
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
          {
            path: "calendar",
            element: (
              <StaffAuthGuard role={StaffRole.Admin}>
                <Admin_CalenderPage />
              </StaffAuthGuard>
            ),
          },
          {
            path: "payroll",
            children: [
              {
                index: true,
                element: (
                  <StaffAuthGuard role={StaffRole.Admin}>
                    <Admin_PayrollPage />
                  </StaffAuthGuard>
                ),
              },
              {
                path: "configs",
                element: (
                  <StaffAuthGuard role={StaffRole.Admin}>
                    <Admin_PayrollConfigsPage />
                  </StaffAuthGuard>
                ),
              },
            ],
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
        element: <KitchenManager_Root />,
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
            path: "dishes",
            element: (
              <StaffAuthGuard role={StaffRole.KitchenManager}>
                <KitchenManager_DishesPage />
              </StaffAuthGuard>
            ),
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
        element: <Cashier_Root />,
        children: [
          {
            index: true,
            element: (
              <StaffAuthGuard role={StaffRole.Cashier}>
                <Cashier_HomePage />
              </StaffAuthGuard>
            ),
          },
        ],
      },
      // Common staff payroll route
      {
        path: "payroll",
        element: <Staff_PayrollPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);
