import { StaffRole } from "@/enums/staff-role";
import {
  AttachMoney,
  CalendarToday,
  EggAlt,
  Fastfood,
  Home,
  Kitchen,
  LocalPizza,
  LocationPin,
  Login,
  MenuBook,
  People,
  RateReview,
  ReceiptLong,
  SupervisedUserCircle,
  TableRestaurant,
} from "@mui/icons-material";

export interface SideMenuLink {
  title: string;
  link: string;
  Icon: any;
  exactLinkMatch?: boolean;
}

export const getSideMenuLinks = (role: StaffRole): SideMenuLink[] => {
  const links: SideMenuLink[] = [];

  switch (role) {
    case StaffRole.Admin:
      links.push(
        {
          title: "Home",
          link: "/staff/admin",
          Icon: Home,
          exactLinkMatch: true,
        },
        {
          title: "Staff",
          link: "/staff/admin/staff",
          Icon: SupervisedUserCircle,
        },
        {
          title: "Dining Areas",
          link: "/staff/admin/dining-areas",
          Icon: LocationPin,
        },
        {
          title: "Dining Tables",
          link: "/staff/admin/dining-tables",
          Icon: TableRestaurant,
        },
        {
          title: "Ingredients",
          link: "/staff/admin/ingredients",
          Icon: EggAlt,
        },
        {
          title: "Dishes",
          link: "/staff/admin/dishes",
          Icon: Fastfood,
        },
        {
          title: "Menus",
          link: "/staff/admin/menus",
          Icon: MenuBook,
        },
        {
          title: "Calendar",
          link: "/staff/admin/calendar",
          Icon: CalendarToday,
        },
        {
          title: "Customers",
          link: "/staff/admin/customers",
          Icon: People,
        },
        {
          title: "Orders",
          link: "/staff/admin/orders",
          Icon: AttachMoney,
        }
        // {
        //   title: "Reservations",
        //   link: "/staff/admin/reservations",
        //   Icon: EventSeat,
        // },
        // {
        //   title: "Offers",
        //   link: "/staff/admin/offers",
        //   Icon: LocalOfferSharp,
        // },
        // {
        //   title: "Settings",
        //   link: "/staff/admin/settings",
        //   Icon: Settings,
        // }
      );
      break;
    case StaffRole.KitchenManager:
      links.push(
        {
          title: "Home",
          link: "/staff/kitchen-manager",
          Icon: Home,
        },
        {
          title: "Orders",
          link: "/staff/kitchen-manager/orders",
          Icon: Fastfood,
        },
        {
          title: "Dishes",
          link: "/staff/kitchen-manager/dishes",
          Icon: LocalPizza,
        },
        {
          title: "Ingredients",
          link: "/staff/kitchen-manager/ingredients",
          Icon: Kitchen,
        }
        // {
        //   title: "Settings",
        //   link: "/staff/kitchen-manager/settings",
        //   Icon: Settings,
        // }
      );
      break;
    case StaffRole.Waiter:
      links.push(
        {
          title: "Dining Table Status",
          link: "/staff/waiter",
          Icon: TableRestaurant,
          exactLinkMatch: true,
        },
        // {
        //   title: "Reservations",
        //   link: "/staff/waiter/customer-reservations",
        //   Icon: EventSeat,
        // },
        {
          title: "Customer Feedbacks",
          link: "/staff/waiter/customer-feedbacks",
          Icon: RateReview,
        }
      );
      break;
    case StaffRole.Cashier:
      links.push({
        title: "Orders",
        link: "/staff/cashier",
        Icon: ReceiptLong,
      });
      break;
    case StaffRole.Receptionist:
      links.push({
        title: "Dashboard",
        link: "/staff/receptionist",
        Icon: Home,
        exactLinkMatch: true,
      });
      break;
    default:
      links.push({
        title: "Login",
        link: "/staff/login",
        Icon: Login,
      });
  }
  return links;
};
