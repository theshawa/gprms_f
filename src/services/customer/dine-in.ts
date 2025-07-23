import { customerBackend } from "@/backend";
import type { DiningTable } from "@/interfaces/dining-table";
import type { Menu } from "@/interfaces/menu";

export class DineInService {
  static async startOrder(tableId: number) {
    const { data } = await customerBackend.post<{
      diningTable: DiningTable;
      menu: Menu;
    }>(`/dine-in/start-order/${tableId}/${Date.now()}`);

    return data;
  }
}
