import { Box, CircularProgress } from "@mui/material";
import { type FC, useLayoutEffect, useState } from "react";
import { Outlet } from "react-router";
import { useAlert } from "../../../alert";
import { staffBackend } from "../../../backend";
import { useStaffAuthState } from "../shared/staff-auth.state";
import { StaffService } from "../shared/staff.service";
import { Header } from "./header";

export const StaffLayout: FC = () => {
  const { auth, setAuth } = useStaffAuthState();
  const [authLoading, setAuthLoading] = useState(true);
  const { showError } = useAlert();

  // intialize authentication
  useLayoutEffect(() => {
    const loadAuth = async () => {
      try {
        const state = await StaffService.refreshAuth();

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

    const refreshInterceptor = staffBackend.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401) {
          try {
            const res = await staffBackend.post("/refresh-auth");
            setAuth(res.data);

            originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
            originalRequest._retry = true;
            console.log("Staff access token refreshed!");

            return staffBackend(originalRequest);
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
      staffBackend.interceptors.response.eject(refreshInterceptor);
    };
  }, []);

  useLayoutEffect(() => {
    const authInjector = staffBackend.interceptors.request.use((config) => {
      if (auth && !(config as any)._retry) {
        config.headers.Authorization = `Bearer ${auth.accessToken}`;
      }
      return config;
    });

    return () => {
      staffBackend.interceptors.request.eject(authInjector);
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
      <Header />
      <Box p={3}>
        <Outlet />
      </Box>
    </>
  );
};
