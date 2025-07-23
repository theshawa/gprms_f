import type { CartItem } from "@/interfaces/cart-item";
import { atom } from "jotai";

export const customerCartAtom = atom<CartItem[]>([]);
