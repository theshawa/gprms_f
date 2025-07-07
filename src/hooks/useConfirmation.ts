import { useAtom } from "jotai";
import { confirmationAtom } from "../atoms/confirmation";

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useAtom(confirmationAtom);

  const confirm = ({
    title,
    message,
    cancelText = "Cancel",
    confirmText = "Yes",
  }: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
  }) => {
    return new Promise<boolean>((resolve) => {
      setConfirmation({
        title,
        message,
        confirmText,
        cancelText,
        open: true,
        onConfirm: (value: boolean) => {
          resolve(value);
          setConfirmation((prev) => ({ ...prev, open: false }));
          setTimeout(() => {
            setConfirmation({
              open: false,
              title: "",
              message: "",
              confirmText: "Yes",
              cancelText: "Cancel",
              onConfirm: () => {},
            });
          }, 300);
        },
      });
    });
  };

  return { _confirmation: confirmation, confirm };
};
