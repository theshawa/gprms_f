import { useAtom } from "jotai";
import { alertAtom } from "../atoms/alert";
import type { AppAlert } from "../interfaces/app-alert";

export const useAlert = () => {
  const [alert, setAlert] = useAtom(alertAtom);

  const showAlert = (newAlert: AppAlert) => {
    setAlert(newAlert);
  };

  const hideAlert = () => {
    setAlert(null);
  };

  const showError = (message: string) => {
    showAlert({
      message,
      severity: "error",
    });
  };

  const showSuccess = (
    message: string,
    action?: { label: string; onClick: () => void }
  ) => {
    showAlert({
      message,
      severity: "success",
      action,
    });
  };

  return { alert, hideAlert, showError, showSuccess };
};
