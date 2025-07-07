export interface AppConfirmation {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: (v: boolean) => void;
}
