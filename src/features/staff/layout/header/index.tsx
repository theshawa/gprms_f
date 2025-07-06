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
import { useAlert } from "../../../../alert";
import { getBackendErrorMessage } from "../../../../backend";
import { useStaffAuthState } from "../../shared/staff-auth.state";
import { getNameForRole } from "../../shared/staff-role.enum";
import { StaffService } from "../../shared/staff.service";
import { SideMenu } from "./sidemenu";

export const Header: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const { auth, setAuth } = useStaffAuthState();
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
            {auth ? getNameForRole(auth?.user.role) : "Staff"} Dashboard
          </Typography>
          {auth && (
            <>
              <Button
                size="large"
                onClick={(e) => setAnchorEl(e.currentTarget)}
                startIcon={<AccountCircle />}
                color="inherit"
              >
                {auth?.user.name}
              </Button>
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
