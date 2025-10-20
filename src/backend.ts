const BACKEND_URL = "http://localhost:5401";

import axios, { AxiosError } from "axios";

export const staffBackend = axios.create({
  baseURL: BACKEND_URL + "/staff",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const customerBackend = axios.create({
  baseURL: BACKEND_URL + "/customer",
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const getBackendErrorMessage = (error: any): string => {
  if (error instanceof AxiosError) {
    console.log(error);

    if (typeof error === "string") {
      return error;
    }

    if (error.response) {
      return (
        error.response.data?.details ||
        error.response.data?.message ||
        "An error occurred on the server."
      );
    } else if (error.request) {
      return "No response received from the server.";
    } else {
      return error.message;
    }
  }
  return "An unknown error occurred.";
};
