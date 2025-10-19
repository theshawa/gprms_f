import { staffBackend } from "@/backend";
import type { Order } from "@/interfaces/orders";

export class OrdersService {
  static async getAll() {
    const { data } = await staffBackend.get<Order[]>("/kitchen-manager/orders");
    return data;
  }
  static async markOrderPreparing(id: number) {
    await staffBackend.put(`/kitchen-manager/mark-order-preparing/${id}`);
  }

  static async markOrderPrepared(id: number) {
    await staffBackend.put(`/kitchen-manager/mark-order-prepared/${id}`);
  }
}
