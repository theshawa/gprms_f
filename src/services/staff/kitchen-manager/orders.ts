import { staffBackend } from "@/backend";
import type { Order } from "@/interfaces/orders";

export class OrdersService {
  static async getAll() {
    const { data } = await staffBackend.get<Order[]>("/kitchen-manager/orders");
    return data;
  }
}
