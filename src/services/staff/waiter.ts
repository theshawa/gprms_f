import { staffBackend } from "@/backend";

export class WaiterService {
  static async acceptTable(tableId: number) {
    const { data } = await staffBackend.post<{ success: boolean }>(
      `/waiter/accept-table/${tableId}`
    );
    return data;
  }
}
