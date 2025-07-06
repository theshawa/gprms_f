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
import { useAtom } from "jotai";
import { type FC, useState } from "react";
import { useNavigate } from "react-router";
import { staffBackend } from "../../../../../backend";
import { staffAuthAtom } from "../../../auth/atom";
import { getNameForRole } from "../../../staff-role";
import { SideMenu } from "./sidemenu";

export const Header: FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sideMenuOpen, setSideMenuOpen] = useState(false);
  const [auth, setAuth] = useAtom(staffAuthAtom);

  const navigate = useNavigate();

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = async () => {
    try {
      await staffBackend.post("/logout");
      setAnchorEl(null);
      setAuth(null);
      navigate("/staff/login", { replace: true });
    } catch (error) {
      console.error("Logout failed", error);
      alert("Logout failed. Please try again.");
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
            {getNameForRole(auth?.user.role!)} Dashboard
          </Typography>
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
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <SideMenu open={sideMenuOpen} toggleOpen={(v) => setSideMenuOpen(v)} />
    </>
  );
};
