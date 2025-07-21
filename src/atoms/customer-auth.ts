import type { CustomerAuthState } from "@/interfaces/customer-auth-state";
import { atom } from "jotai";

export const customerAuthAtom = atom<CustomerAuthState | null>(null);
