import { AccountCircle } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { type FC, useState } from "react";
import { getBackendErrorMessage } from "../../../../backend";
import { getNameForRole } from "../../../../enums/staff-role";
import { useAlert } from "../../../../hooks/useAlert";
import { useStaffAuth } from "../../../../hooks/useStaffAuth";
import { StaffService } from "../../../../services/staff";
import { SideMenu } from "./sidemenu";

export const Header: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const { auth, setAuth } = useStaffAuth();
  const { showError } = useAlert();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    try {
      await StaffService.logout();
      setAuth(null);
      setAnchorEl(null);
    } catch (error) {
      showError(getBackendErrorMessage(error));
    }
  };

  if (!auth) {
    return null;
  }

  return (
    <>
      <AppBar position="sticky">
        <Toolbar>
          <IconButton
            onClick={() => setSideMenuOpen(true)}
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {getNameForRole(auth.user.role)} Dashboard
          </Typography>
          {auth && (
            <>
              <span className="hidden sm:block">
                <Button
                  size="large"
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  startIcon={<AccountCircle />}
                  color="inherit"
                  className="hidden sm:block m-20"
                >
                  {auth?.user.name}
                </Button>
              </span>
              <span className="sm:hidden">
                <IconButton
                  onClick={(e) => setAnchorEl(e.currentTarget)}
                  size="large"
                  color="inherit"
                >
                  <AccountCircle />
                </IconButton>
              </span>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={!!anchorEl}
                onClose={handleClose}
              >
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </AppBar>
      <SideMenu open={sideMenuOpen} toggleOpen={(v) => setSideMenuOpen(v)} />
    </>
  );
};
