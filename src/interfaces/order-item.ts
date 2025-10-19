import type { Dish } from "./dish";
import type { Order } from "./orders";

export interface OrderItem {
  id: number;
  orderId: number;
  order?: Order;
  dishId: number;
  dish?: Dish;
  quantity: number;
  price: number;
}