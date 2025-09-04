import type { Dish } from "./dish";

export interface TakeAwayOrder {
  id: number;
  customerName: string;
  customerPhone: string;
  notes: string;
  items: {
    dish: Dish;
    quantity: number;
    priceAtOrder: number;
  };
  totalAmount: number;
  status: "New" | "InProgress" | "Completed" | "Rejected";
  createdAt: string;
}
