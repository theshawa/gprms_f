import { customerLoginDialogAtom } from "@/atoms/customer-login-dialog";
import { useAtom } from "jotai";

export const useCustomerLoginDialogOpen = () => {
  const [isOpen, setIsOpen] = useAtom(customerLoginDialogAtom);

  const openDialog = () => setIsOpen(true);
  const closeDialog = () => setIsOpen(false);

  return {
    isOpen,
    openDialog,
    closeDialog,
  };
};
