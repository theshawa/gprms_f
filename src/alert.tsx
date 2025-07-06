import { Alert, Button, Snackbar } from "@mui/material";
import { atom, useAtom } from "jotai";
import type { FC } from "react";

export interface AppAlert {
  title?: string;
  message: string;
  severity: "success" | "info" | "warning" | "error";
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const alertAtom = atom<AppAlert | null>(null);

export const useAlert = () => {
  const [alert, setAlert] = useAtom(alertAtom);

  const showAlert = (newAlert: AppAlert) => {
    setAlert(newAlert);
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return { alert, showAlert, hideAlert };
};

export const AlertComponent: FC = () => {
  const { alert, hideAlert } = useAlert();

  if (!alert) return null;

  const action = alert.action ? (
    <Button color="inherit" size="small" onClick={alert.action.onClick}>
      {alert.action.label}
    </Button>
  ) : null;

  return (
    <Snackbar open={!!alert} autoHideDuration={6000} onClose={hideAlert}>
      <Alert
        onClose={hideAlert}
        severity={alert.severity}
        variant="filled"
        sx={{ width: "100%" }}
        action={action}
        title={alert.title}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
};
