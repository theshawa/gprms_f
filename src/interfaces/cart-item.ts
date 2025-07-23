import type { Dish } from "./dish";

export interface CartItem {
  dish: Dish;
  quantity: number;
}
