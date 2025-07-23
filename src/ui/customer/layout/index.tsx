import { customerBackend } from "@/backend";
import { useAlert } from "@/hooks/useAlert";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { CustomerAuthService } from "@/services/customer/customer-auth";
import { Box, CircularProgress } from "@mui/material";
import type { FC } from "react";
import { useLayoutEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./header";
import { LoginDialog } from "./login-dialog";

export const Customer_Layout: FC = () => {
  const { auth, setAuth } = useCustomerAuth();
  const [authLoading, setAuthLoading] = useState(true);
  const { showError } = useAlert();
  const location = useLocation();

  const inDineInPage = location.pathname.startsWith("/dine-in");

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
      {!inDineInPage && <Header />}


      <LoginDialog />

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
                  href="contact"
                  className="text-sm text-gray-700 hover:text-gray-900 font-medium"
                >
                  Contact
                </a>


      <Outlet />

      {!inDineInPage && (
        <footer className="bg-[#003d2d] text-white px-6 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between gap-8">
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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between text-xs gap-4">
            <div className="flex gap-4">
              <a href="#">Privacy Policy</a>
              <a href="#">Terms of Service</a>
              <a href="#">Cookies Settings</a>


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
                href="contact"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                Contact
              </a>
              <div>
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

            </div>
            <div>© 2025 THON HOTELS. All rights reserved.</div>
          </div>
        </footer>
      )}

      {/* Footer (unchanged) */}
    </>
  );
};
