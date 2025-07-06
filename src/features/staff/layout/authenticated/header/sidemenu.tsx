import {
  Checklist,
  Fastfood,
  Home,
  Kitchen,
  LocalPizza,
  LocationPin,
  LunchDining,
  MenuBook,
  People,
  Settings,
  TableRestaurant,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useAtomValue } from "jotai";
import { type FC, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { staffAuthAtom } from "../../../auth/atom";
import { StaffRole } from "../../../staff-role";

export const SideMenu: FC<{
  open: boolean;
  toggleOpen: (v: boolean) => void;
}> = ({ open, toggleOpen }) => {
  const auth = useAtomValue(staffAuthAtom);
  const location = useLocation();
  const links = useMemo(() => {
    if (!auth) return [];

    const links: {
      title: string;
      link: string;
      Icon: any;
    }[] = [];
    switch (auth.user.role) {
      case StaffRole.Admin:
        links.push(
          {
            title: "Home",
            link: "/staff/admin",
            Icon: Home,
          },
          { title: "Staff", link: "/staff/admin/staff", Icon: People },
          {
            title: "Locations",
            link: "/staff/admin/locations",
            Icon: LocationPin,
          },
          {
            title: "Tables",
            link: "/staff/admin/tables",
            Icon: TableRestaurant,
          },
          {
            title: "Meals",
            link: "/staff/admin/meals",
            Icon: Fastfood,
          },
          {
            title: "Menus",
            link: "/staff/admin/menus",
            Icon: MenuBook,
          },
          {
            title: "Settings",
            link: "/staff/admin/settings",
            Icon: Settings,
          }
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
            title: "Meals",
            link: "/staff/kitchen-manager/meals",
            Icon: LocalPizza,
          },
          {
            title: "Ingredients",
            link: "/staff/kitchen-manager/ingredients",
            Icon: Kitchen,
          }
        );
        break;
    }
    return links;
  }, [auth]);

  return (
    <Drawer open={open} onClose={() => toggleOpen(false)}>
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={() => toggleOpen(false)}
      >
        <List>
          {links.map(({ title, link, Icon }) => (
            <ListItem key={title} disablePadding>
              <Link
                to={link}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%",
                }}
              >
                <ListItemButton selected={location.pathname.includes(link)}>
                  <ListItemIcon>
                    <Icon />
                  </ListItemIcon>
                  <ListItemText primary={title} />
                </ListItemButton>
              </Link>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};
