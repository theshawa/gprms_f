import { atom } from "jotai";
import type { AppConfirmation } from "../interfaces/app-confirmation";

export const confirmationAtom = atom<AppConfirmation>({
  open: false,
  title: "",
  message: "",
  confirmText: "Yes",
  cancelText: "Cancel",
  onConfirm: () => {},
});
