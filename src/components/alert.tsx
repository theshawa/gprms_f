import { useAlert } from "@/hooks/useAlert";
import { Alert, Button, Snackbar } from "@mui/material";
import type { FC } from "react";

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
      >
        {alert.message}
      </Alert>
    </Snackbar>
  );
};
