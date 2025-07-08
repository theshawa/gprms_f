import type { AppAlert } from "@/interfaces/app-alert";
import { atom } from "jotai";

export const alertAtom = atom<AppAlert | null>(null);
