import { atom } from "jotai";
import type { CartItem } from "@/interfaces/cart-item";

export interface OrderRound {
  id: number;
  items: CartItem[];
  orderedAt: Date;
  status: 'cooking' | 'served' | 'preparing';
  estimatedTime?: number; // in minutes
}

export interface DiningSession {
  tableNumber: string;
  startedAt: Date;
  orderRounds: OrderRound[];
  currentRoundId: number;
  isFinished: boolean;
  isPaidOut: boolean;
}

export const diningSessionAtom = atom<DiningSession | null>(null);
