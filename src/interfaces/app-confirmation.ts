export interface AppConfirmation {
  open: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  confirmButtonDanger?: boolean;
  onConfirm: (v: boolean) => void;
}
