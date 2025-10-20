import { customerBackend } from "@/backend";
import type { Order } from "@/interfaces/orders";
import type { PlaceOrderRequest } from "@/interfaces/place-order-request";

export class CustomerOrderService {
  // Place a general order (legacy support)
  static async placeOrder(orderData: PlaceOrderRequest): Promise<Order> {
    const { data } = await customerBackend.post<Order>(
      "/menu/orders",
      orderData
    );
    return data;
  }

  // Place a dine-in order for a specific table
  static async placeDineInOrder(tableId: number, orderData: PlaceOrderRequest): Promise<Order> {
    const { data } = await customerBackend.post<Order>(
      `/dine-in/tables/${tableId}/place-order`,
      orderData
    );
    return data;
  }

  // Get order details by order code
  static async getOrder(orderCode: string) {
    const { data } = await customerBackend.get<Order>(
      `/menu/orders/${orderCode}`
    );
    return data;
  }

  // Get dine-in order details for a specific table
  static async getDineInOrder(tableId: number, orderCode: string) {
    const { data } = await customerBackend.get<Order>(
      `/dine-in/tables/${tableId}/orders/${orderCode}`
    );
    return data;
  }

  // Get current active order for a table
  static async getCurrentTableOrder(tableId: number) {
    const { data } = await customerBackend.get<Order>(
      `/dine-in/tables/${tableId}/current-order`
    );
    return data;
  }

  // Get all orders for a table session
  static async getTableOrders(tableId: number) {
    const { data } = await customerBackend.get<Order[]>(
      `/dine-in/tables/${tableId}/orders`
    );
    return data;
  }

  // Update order status (for customer modifications)
  static async updateOrderItems(tableId: number, orderCode: string, items: any[]) {
    const { data } = await customerBackend.put<Order>(
      `/dine-in/tables/${tableId}/orders/${orderCode}/items`,
      { items }
    );
    return data;
  }

  // Cancel an order
  static async cancelOrder(tableId: number, orderCode: string, reason?: string) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/orders/${orderCode}/cancel`,
      { reason }
    );
    return data;
  }
}
