import { useAtom } from "jotai";
import { staffAuthAtom } from "../atoms/staff-auth";

export const useStaffAuth = () => {
  const [auth, setAuth] = useAtom(staffAuthAtom);

  return {
    auth,
    setAuth,
  };
};
