import { customerBackend } from "@/backend";
import type { Order } from "@/interfaces/orders";
import type { PlaceOrderRequest } from "@/interfaces/place-order-request";

export class OrderService {
  static async placeOrder(orderData: PlaceOrderRequest): Promise<Order> {
    const { data } = await customerBackend.post<Order>(
      "/menu/orders",
      orderData
    );
    return data;
  }

  static async getOrder(orderCode: string) {
    const { data } = await customerBackend.get<Order>(
      `/menu/orders/${orderCode}`
    );
    return data;
  }
}
