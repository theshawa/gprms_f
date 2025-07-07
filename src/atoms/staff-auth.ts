import { atom } from "jotai";
import type { StaffAuthState } from "../interfaces/staff-auth-state";

export const staffAuthAtom = atom<StaffAuthState | null>(null);
