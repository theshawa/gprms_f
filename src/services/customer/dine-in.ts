import { customerBackend } from "@/backend";
import type { DiningTable } from "@/interfaces/dining-table";
import type { Menu } from "@/interfaces/menu";
import type { Dish } from "@/interfaces/dish";
import type { Order } from "@/interfaces/orders";
import type { PlaceOrderRequest } from "@/interfaces/place-order-request";

export class CustomerDineInService {
  // Initialize dine-in session for a table
  static async initializeDineIn(tableId: number) {
    const { data } = await customerBackend.post<{
      diningTable: DiningTable;
      menu: Menu;
    }>(`/dine-in/tables/${tableId}/initialize`, {
      timestamp: Date.now()
    });
    return data;
  }

  // Get menu items for dine-in (table-specific menu)
  static async getMenuItems(tableId: number, query?: string) {
    const { data } = await customerBackend.get<Dish[]>(
      `/dine-in/tables/${tableId}/menu-items`, 
      {
        params: { query }
      }
    );
    return data;
  }

  // Get specific dish details for dine-in
  static async getDishDetails(tableId: number, dishId: string) {
    const { data } = await customerBackend.get<Dish>(
      `/dine-in/tables/${tableId}/menu-items/${dishId}`
    );
    return data;
  }

  // Place dine-in order
  static async placeDineInOrder(tableId: number, orderData: PlaceOrderRequest) {
    const { data } = await customerBackend.post<Order>(
      `/dine-in/tables/${tableId}/place-order`,
      orderData
    );
    return data;
  }

  // Get current dine-in order status
  static async getDineInOrderStatus(tableId: number, orderCode?: string) {
    const endpoint = orderCode 
      ? `/dine-in/tables/${tableId}/orders/${orderCode}/status`
      : `/dine-in/tables/${tableId}/current-order/status`;
    
    const { data } = await customerBackend.get<Order>(endpoint);
    return data;
  }

  // Get all orders for the table session
  static async getTableOrders(tableId: number) {
    const { data } = await customerBackend.get<Order[]>(
      `/dine-in/tables/${tableId}/orders`
    );
    return data;
  }

  // Request waiter assistance
  static async requestWaiterAssistance(tableId: number, assistanceType: string, notes?: string) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/request-waiter`,
      {
        assistanceType,
        notes,
        timestamp: Date.now()
      }
    );
    return data;
  }

  // Get assigned waiter information
  static async getAssignedWaiter(tableId: number) {
    const { data } = await customerBackend.get(
      `/dine-in/tables/${tableId}/assigned-waiter`
    );
    return data;
  }

  // Update order items (for modifications)
  static async updateOrderItems(tableId: number, orderCode: string, items: any[]) {
    const { data } = await customerBackend.put(
      `/dine-in/tables/${tableId}/orders/${orderCode}/items`,
      { items }
    );
    return data;
  }

  // Request bill/checkout
  static async requestBill(tableId: number) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/request-bill`
    );
    return data;
  }

  // Get table session information
  static async getTableSession(tableId: number) {
    const { data } = await customerBackend.get(
      `/dine-in/tables/${tableId}/session`
    );
    return data;
  }

  // End dine-in session
  static async endDineInSession(tableId: number) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/end-session`
    );
    return data;
  }

  // Legacy method for backward compatibility
  static async startOrder(tableId: number) {
    return this.initializeDineIn(tableId);
  }
}
