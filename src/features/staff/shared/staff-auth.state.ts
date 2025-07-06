import { atom, useAtom } from "jotai";

import type { StaffRole } from "./staff-role.enum";

export interface StaffUser {
  id: number;
  username: string;
  name: string;
  role: StaffRole;
}

export interface StaffAuthState {
  accessToken: string;
  user: StaffUser;
}

const staffAuthAtom = atom<StaffAuthState | null>(null);

export const useStaffAuthState = () => {
  const [auth, setAuth] = useAtom(staffAuthAtom);

  return {
    auth,
    setAuth,
  };
};
