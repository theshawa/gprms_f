import { staffBackend } from "@/backend";

export class KitchenManagerTakeAwayOrderService {
  static async markTakeAwayOrderPreparing(id: number) {
    await staffBackend.put(`/kitchen-manager/mark-take-away-order-preparing/${id}`);
  }

  static async markTakeAwayOrderPrepared(id: number) {
    await staffBackend.put(`/kitchen-manager/mark-take-away-order-prepared/${id}`);
  }
}
