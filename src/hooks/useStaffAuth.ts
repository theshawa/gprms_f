import { staffAuthAtom } from "@/atoms/staff-auth";
import { useAtom } from "jotai";

export const useStaffAuth = () => {
  const [auth, setAuth] = useAtom(staffAuthAtom);

  return {
    auth,
    setAuth,
  };
};
