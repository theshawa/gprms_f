import type { AppConfirmation } from "@/interfaces/app-confirmation";
import { atom } from "jotai";

export const confirmationAtom = atom<AppConfirmation>({
  open: false,
  title: "",
  message: "",
  confirmText: "Yes",
  cancelText: "Cancel",
  onConfirm: () => {},
});
