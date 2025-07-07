import {
  Fastfood,
  Home,
  LocationPin,
  Login,
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
import { type FC, useMemo } from "react";
import { Link, useLocation } from "react-router";
import { StaffRole } from "../../../../enums/staff-role";
import { useStaffAuth } from "../../../../hooks/useStaffAuth";

export const SideMenu: FC<{
  open: boolean;
  toggleOpen: (v: boolean) => void;
}> = ({ open, toggleOpen }) => {
  const { auth } = useStaffAuth();
  const location = useLocation();
  const links = useMemo(() => {
    const links: {
      title: string;
      link: string;
      Icon: any;
      exactLinkMatch?: boolean;
    }[] = [];
    switch (auth?.user.role) {
      case StaffRole.Admin:
        links.push(
          {
            title: "Home",
            link: "/staff/admin",
            Icon: Home,
            exactLinkMatch: true,
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
      default:
        links.push({
          title: "Login",
          link: "/staff/login",
          Icon: Login,
        });
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
          {links.map(({ title, link, Icon, exactLinkMatch }) => (
            <ListItem key={title} disablePadding>
              <Link
                to={link}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                  width: "100%",
                }}
              >
                <ListItemButton
                  selected={
                    exactLinkMatch
                      ? location.pathname === link
                      : location.pathname.includes(link)
                  }
                >
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
