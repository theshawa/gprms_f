import type { StaffAuthState } from "@/interfaces/staff-auth-state";
import { atom } from "jotai";

export const staffAuthAtom = atom<StaffAuthState | null>(null);
