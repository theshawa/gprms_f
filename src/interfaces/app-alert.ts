export interface AppAlert {
  message: string;
  severity: "success" | "info" | "warning" | "error";
  action?: {
    label: string;
    onClick: () => void;
  };
}
