import { customerBackend } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useCustomerLoginDialogOpen } from "@/hooks/useCustomerLoginDialogOpen";
import { CustomerAuthService } from "@/services/customer/customer-auth";
import {
  Close,
  ExpandMore,
  Menu as MenuIcon,
  Person,
} from "@mui/icons-material";
import { Box, Button, CircularProgress, Menu, MenuItem } from "@mui/material";
import type { FC } from "react";
import { useLayoutEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { LoginDialog } from "./login-dialog";

export const Customer_Layout: FC = () => {
  const [aboutUsMenuAnchorEl, setAboutUsMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { openDialog: openCustomerLoginDialog } = useCustomerLoginDialogOpen();

  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { auth, setAuth } = useCustomerAuth();
  const [authLoading, setAuthLoading] = useState(true);
  const { showError } = useAlert();

  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const logout = async () => {
    setIsLoggingOut(true);
    try {
      await CustomerAuthService.logout();
      setAuth(null);
    } catch (error) {
      showError("Failed to log out. Please try again later.");
    } finally {
      setProfileAnchorEl(null);
      setIsLoggingOut(false);
    }
  };

  // intialize authentication
  useLayoutEffect(() => {
    const loadAuth = async () => {
      try {
        const state = await CustomerAuthService.refreshAuth();

        if (state) {
          setAuth(state);
        }
      } catch (error) {
        showError("Failed to load authentication. Please refresh the page.");
      } finally {
        setAuthLoading(false);
      }
    };

    if (auth) {
      setAuthLoading(false);
      return;
    }

    loadAuth();

    const refreshInterceptor = customerBackend.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401) {
          try {
            const res = await customerBackend.post("/refresh-auth");
            setAuth(res.data);

            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            originalRequest._retry = true;
            console.log("Customer access token refreshed!");

            return customerBackend(originalRequest);
          } catch (error) {
            showError(
              "Your login session expired. Please login again to continue."
            );
            setAuth(null);
          }
        }

        return Promise.reject(error);
      }
    );

    return () => {
      customerBackend.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  useLayoutEffect(() => {
    const authInjector = customerBackend.interceptors.request.use((config) => {
      if (auth && !(config as any)._retry) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
      return config;
    });

    return () => {
      customerBackend.interceptors.request.eject(authInjector);
    };
  }, [auth]);

  if (authLoading) {
    return (
      <Box className="w-full h-screen flex items-center justify-center text-center">
        <CircularProgress size={20} />
      </Box>
    );
  }

  return (
    <>
      <header className="bg-white border-b border-gray-100 sticky top-0 z-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[54px]">
            {/* Left Nav */}
            <div className="flex items-center space-x-8">
              <a href="/">
                <img src="/logo.png" alt="Logo" className="h-7 w-auto" />
              </a>

              <nav className="hidden md:flex items-center space-x-6">
                <a
                  href="menu"
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium"
                >
                  Menu
                </a>
                <a
                  href="reservations"
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium"
                >
                  Reservations
                </a>
                <a
                  href="#"
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium"
                >
                  Contact
                </a>

                <div className="relative">
                  <button
                    onClick={(e) => setAboutUsMenuAnchorEl(e.currentTarget)}
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900 font-medium"
                  >
                    About us
                    <ExpandMore className="ml-1" fontSize="small" />
                  </button>
                  <Menu
                    anchorEl={aboutUsMenuAnchorEl}
                    open={!!aboutUsMenuAnchorEl}
                    onClose={() => setAboutUsMenuAnchorEl(null)}
                  >
                    <MenuItem>
                      <Link to="/our-story" className="w-full">
                        Our Story
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link to="/dining-areas" className="w-full">
                        Dining Areas
                      </Link>
                    </MenuItem>
                  </Menu>
                </div>
              </nav>
            </div>

            {/* Right: User & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              {auth ? (
                <>
                  <Button
                    disabled={isLoggingOut}
                    onClick={(e) => setProfileAnchorEl(e.currentTarget)}
                    startIcon={<Person />}
                    variant="text"
                    color="inherit"
                  >
                    {auth.user.name || "Profile"}
                  </Button>
                  <Menu
                    anchorEl={profileAnchorEl}
                    open={!!profileAnchorEl}
                    onClose={() => setProfileAnchorEl(null)}
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "left",
                    }}
                  >
                    <MenuItem disabled={isLoggingOut} onClick={logout}>
                      {isLoggingOut ? <CircularProgress size={20} /> : "Logout"}
                    </MenuItem>
                  </Menu>
                </>
              ) : (
                <Button color="inherit" onClick={openCustomerLoginDialog}>
                  Login
                </Button>
              )}

              {/* Mobile Menu Toggle */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
                >
                  {mobileMenuOpen ? (
                    <Close className="h-5 w-5 text-gray-700" />
                  ) : (
                    <MenuIcon className="h-5 w-5 text-gray-700" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-2 space-y-1 pb-4 border-t border-gray-200">
              <a
                href="menu"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Menu
              </a>
              <a
                href="reservations"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Reservations
              </a>
              <a
                href="#"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Contact
              </a>
              <div>
                <button
                  onClick={(e) => setAboutUsMenuAnchorEl(e.currentTarget)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex justify-between"
                >
                  About Us
                  <ExpandMore fontSize="small" />
                </button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* SIGNUP POPUP */}
      <LoginDialog />
      {/* <Dialog open={signupOpen} maxWidth="xs" fullWidth>
        <DialogTitle>Login to Your Account</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            placeholder="eg: James Phillips"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="dense"
            fullWidth
            variant="filled"
          />
          <TextField
            label="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            margin="dense"
            fullWidth
            placeholder="eg: 07XXXXXXXX"
            type="tel"
            variant="filled"
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleSignupSubmit}
            variant="contained"
            disabled={!name || !/^\d{10}$/.test(mobile)}
          >
            Sign Up
          </Button>
          <Button onClick={() => setSignupOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog> */}

      <main>
        <Outlet />
      </main>

      {/* Footer (unchanged) */}
      <footer className="bg-[#003d2d] text-white px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <img src="/logo.png" alt="Logo" className="h-8 mb-4" />
            <ul className="flex flex-wrap gap-6 text-sm">
              <li>
                <a href="#">About Us</a>
              </li>
              <li>
                <a href="#">Contact Us</a>
              </li>
              <li>
                <a href="#">Menu Options</a>
              </li>
              <li>
                <a href="#">Reservation Info</a>
              </li>
            </ul>
          </div>
          <div className="text-sm">
            <p className="mb-2 font-semibold">To receive latest offers</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-md bg-[#004d3d] text-white border border-white placeholder:text-gray-300 focus:outline-none"
              />
              <button className="px-4 py-2 rounded-md border border-white hover:bg-white hover:text-[#003d2d] transition">
                Join
              </button>
            </div>
          </div>
        </div>
        <div className="my-6 border-t border-gray-400" />
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between text-xs gap-4">
          <div className="flex gap-4">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookies Settings</a>
          </div>
          <div>© 2025 THON HOTELS. All rights reserved.</div>
        </div>
      </footer>
    </>
  );
};
