import { staffBackend } from "@/backend";

export class CashierTakeAwayOrderService {
  static async cancelTakeAwayOrder(id: number) {
    await staffBackend.put(`/cashier/cancel-take-away-order/${id}`);
  }

  static async completeTakeAwayOrder(id: number) {
    await staffBackend.put(`/cashier/complete-take-away-order/${id}`);
  }
}
