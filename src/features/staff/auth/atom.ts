import { atom } from "jotai";
import type { StaffAuthState } from "./auth-state";

export const staffAuthAtom = atom<StaffAuthState | null>(null);
