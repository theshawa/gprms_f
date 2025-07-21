import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { useState } from "react";
import {
  ExpandMore,
  Menu as MenuIcon,
  Close,
  Person,
} from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";
import axios from "axios";

export const Customer_Layout: FC = () => {
  const [isOurStoryOpen, setIsOurStoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [signupOpen, setSignupOpen] = useState(false);
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [error, setError] = useState("");

  const handleSignupSubmit = async () => {
    try {
      const response = await axios.post("/api/customers/signup", {
        name,
        mobile,
      });

      console.log("Signup success", response.data);
      setSignupOpen(false);
      setIsLoggedIn(true);
      setName("");
      setMobile("");
      setError("");
      alert("Signup successful!");
    } catch (err: any) {
      console.error("Signup failed", err);
      const msg =
        err.response?.data?.error || "Something went wrong. Try again.";
      setError(msg);
    }
  };

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
                    onClick={() => setIsOurStoryOpen(!isOurStoryOpen)}
                    className="flex items-center text-sm text-gray-700 hover:text-gray-900 font-medium"
                  >
                    Our Story
                    <ExpandMore className="ml-1" fontSize="small" />
                  </button>
                  {isOurStoryOpen && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg border py-2 z-50">
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        About Us
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Our Heritage
                      </a>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        Locations
                      </a>
                    </div>
                  )}
                </div>
              </nav>
            </div>

            {/* Right: User & Mobile Toggle */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Person className="text-gray-600" fontSize="small" />
                </button>
              ) : (
                <button
                  onClick={() => setSignupOpen(true)}
                  className="text-white px-4 py-2 rounded-md bg-green-900 hover:bg-green-800 text-sm font-medium"
                >
                  Login / Sign Up
                </button>
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
                  onClick={() => setIsOurStoryOpen(!isOurStoryOpen)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex justify-between"
                >
                  Our Story
                  <ExpandMore fontSize="small" />
                </button>
                {isOurStoryOpen && (
                  <div className="pl-4">
                    <a
                      href="#"
                      className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      About Us
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Our Heritage
                    </a>
                    <a
                      href="#"
                      className="block px-4 py-1 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Locations
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* SIGNUP POPUP */}
      <Dialog
        open={signupOpen}
        onClose={() => setSignupOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Sign Up</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            placeholder="eg: James Phillips"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="dense"
            fullWidth
          />
          <TextField
            label="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            margin="dense"
            fullWidth
            placeholder="eg: 07XXXXXXXX"
            type="tel"
            inputProps={{ maxLength: 10 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSignupOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSignupSubmit}
            variant="contained"
            disabled={!name || !/^\d{10}$/.test(mobile)}
          >
            Sign Up
          </Button>
        </DialogActions>
      </Dialog>

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
