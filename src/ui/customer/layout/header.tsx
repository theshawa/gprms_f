import { useAlert } from "@/hooks/useAlert";
import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { useCustomerLoginDialogOpen } from "@/hooks/useCustomerLoginDialogOpen";
import { CustomerAuthService } from "@/services/customer/customer-auth";
import { Close, ExpandMore, MenuOpen, Person } from "@mui/icons-material";
import { Button, CircularProgress, Menu, MenuItem } from "@mui/material";
import { type FC, useState } from "react";
import { Link } from "react-router-dom";

export const Header: FC = () => {
  const [aboutUsMenuAnchorEl, setAboutUsMenuAnchorEl] =
    useState<null | HTMLElement>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { openDialog: openCustomerLoginDialog } = useCustomerLoginDialogOpen();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState<null | HTMLElement>(
    null
  );

  const { auth, setAuth } = useCustomerAuth();

  const { showError } = useAlert();

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
  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[54px]">
          {/* Left Nav */}
          <div className="flex items-center space-x-8">
            <a href="/">
              <img src="/logo.png" alt="Logo" className="h-7 w-auto" />
            </a>

            <nav className="hidden md:flex items-center space-x-6">
              <Link
                to="/menu"
                className="text-sm text-gray-700 hover:text-gray-900 font-medium"
              >
                Menu
              </Link>
              <Link
                to="/takeaway"
                className="text-sm text-gray-700 hover:text-gray-900 font-medium"
              >
                Takeaway
              </Link>
              <Link
                to="/reservations"
                className="text-sm text-gray-700 hover:text-gray-900 font-medium"
              >
                Reservations
              </Link>
              <Link
                to="/contact"
                className="text-sm text-gray-700 hover:text-gray-900 font-medium"
              >
                Contact
              </Link>

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
          <div className="flex items-center space-x-5">
            {auth ? (
              <>
                <Button
                  disabled={isLoggingOut}
                  onClick={(e) => setProfileAnchorEl(e.currentTarget)}
                  startIcon={<Person />}
                  variant="text"
                  color="inherit"
                  className="truncate"
                >
                  <span className="sm:hidden">
                    {auth.user.name.length > 10
                      ? `${auth.user.name.slice(0, 10)}...`
                      : auth.user.name || "Profile"}
                  </span>
                  <span className="hidden sm:inline">
                    {auth.user.name || "Profile"}
                  </span>
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
                  <MenuOpen className="h-5 w-5 text-gray-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 space-y-1 pb-4 border-t border-gray-200">
            <Link
              to="/menu"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Menu
            </Link>
            <Link
              to="/takeaway"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Takeaway
            </Link>
            <Link
              to="/reservations"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Reservations
            </Link>
            <Link
              to="/contact"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              Contact
            </Link>
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
  );
};