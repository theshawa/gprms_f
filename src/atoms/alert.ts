import { atom } from "jotai";
import type { AppAlert } from "../interfaces/app-alert";

export const alertAtom = atom<AppAlert | null>(null);
