import { staffBackend } from "@/backend";

export interface DineInOrder {
  id: number;
  orderCode: string;
  status: string;
  totalAmount: number;
  notes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  completedAt: Date | string | null;
  rejectedAt: Date | string | null;
  customer: {
    id: number;
    name: string;
    phoneNumber: string;
  } | null;
  waiter: {
    id: number;
    username: string;
  } | null;
  orderItems: Array<{
    id: number;
    quantity: number;
    price: number;
    dish: {
      id: number;
      name: string;
    };
  }>;
}

export interface TakeAwayOrder {
  id: number;
  customerName: string;
  customerPhone: string;
  notes: string;
  totalAmount: number;
  status: string;
  createdAt: Date | string;
  items: Array<{
    id: number;
    quantity: number;
    priceAtOrder: number;
    dish: {
      id: number;
      name: string;
    };
  }>;
}

export interface OrderFilters {
  date?: string;
  month?: string;
  year?: string;
}

export class OrdersService {
  static async getDineInOrders(filters?: OrderFilters) {
    const params = new URLSearchParams();
    
    if (filters?.date) params.append("date", filters.date);
    if (filters?.month) params.append("month", filters.month);
    if (filters?.year) params.append("year", filters.year);

    const url = `/admin/orders/dine-in${params.toString() ? `?${params.toString()}` : ""}`;
    const { data } = await staffBackend.get<DineInOrder[]>(url);
    return data;
  }

  static async getTakeAwayOrders(filters?: OrderFilters) {
    const params = new URLSearchParams();
    
    if (filters?.date) params.append("date", filters.date);
    if (filters?.month) params.append("month", filters.month);
    if (filters?.year) params.append("year", filters.year);

    const url = `/admin/orders/take-away${params.toString() ? `?${params.toString()}` : ""}`;
    const { data } = await staffBackend.get<TakeAwayOrder[]>(url);
    return data;
  }
}
