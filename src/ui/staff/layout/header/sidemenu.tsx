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
import { Link, useLocation } from "react-router-dom";
import { useStaffAuth } from "../../../../hooks/useStaffAuth";
import { getSideMenuLinks } from "./links";

export const SideMenu: FC<{
  open: boolean;
  toggleOpen: (v: boolean) => void;
}> = ({ open, toggleOpen }) => {
  const { auth } = useStaffAuth();
  const location = useLocation();
  const links = useMemo(() => {
    if (auth?.user) {
      return getSideMenuLinks(auth.user.role);
    }
    return [];
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
