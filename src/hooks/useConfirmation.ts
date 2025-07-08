import { useAtom } from "jotai";
import { confirmationAtom } from "../atoms/confirmation";

export const useConfirmation = () => {
  const [confirmation, setConfirmation] = useAtom(confirmationAtom);

  const confirm = ({
    title,
    message,
    cancelText = "Cancel",
    confirmText = "Yes",
    confirmButtonDanger = false,
  }: {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmButtonDanger?: boolean;
  }) => {
    return new Promise<boolean>((resolve) => {
      setConfirmation({
        title,
        message,
        confirmText,
        cancelText,
        open: true,
        confirmButtonDanger,
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
              confirmButtonDanger: false,
            });
          }, 300);
        },
      });
    });
  };

  return { _confirmation: confirmation, confirm };
};
