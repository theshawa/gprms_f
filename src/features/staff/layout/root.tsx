import { Box, CircularProgress } from "@mui/material";
import { useAtom } from "jotai";
import { type FC, useLayoutEffect, useState } from "react";
import { Outlet } from "react-router";
import { useAlert } from "../../../alert";
import { staffBackend } from "../../../backend";
import { staffAuthAtom } from "../auth/atom";
import type { StaffUser } from "../auth/auth-state";

export const StaffRootLayout: FC = () => {
  const [auth, setAuth] = useAtom(staffAuthAtom);
  const [authLoading, setAuthLoading] = useState(true);
  const { showAlert } = useAlert();

  useLayoutEffect(() => {
    const loadAuth = async () => {
      await new Promise((res) => setTimeout(res, 2000));
      try {
        const { data } = await staffBackend.post<null | {
          accessToken: string;
          user: StaffUser;
        }>("/refresh-auth");

        if (data) {
          setAuth(data);
        }
      } catch (error) {
        showAlert({
          title: "Authentication Error",
          message: "Failed to load authentication. Please refresh the page.",
          severity: "error",
        });
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
            showAlert({
              message:
                "Your login session expired. Please login again to continue.",
              severity: "error",
            });
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

  return <Outlet />;
};
