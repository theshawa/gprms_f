import type { Customer } from "./customer";
import type { OrderItem } from "./order-item";
import type { Reservation } from "./reservation";
import type { StaffUser } from "./staff-user";

export interface Order {
  id: number;
  orderCode: string;
  status: "New" | "InProgress" | "Ready" | "Completed" | "Rejected";
  totalAmount: number;
  createdAt: string;
  updatedAt: string;

  // Optional links (for dine-in context)
  reservationId?: number | null;
  reservation?: Reservation | null;

  customerId?: number | null;
  customer?: Customer | null;

  waiterId?: number | null;
  waiter?: StaffUser | null;

  // Relationship to order items
  orderItems: OrderItem[];

  // Optional notes (special instructions)
  notes?: string | null;

  // Timestamps for tracking
  completedAt?: string | null;
  rejectedAt?: string | null;
}