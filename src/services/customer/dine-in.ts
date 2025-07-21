import { customerBackend } from "@/backend";
import type { DiningTable } from "@/interfaces/dining-table";

export class DineInService {
  static getDiningTableById(id: number) {
    return customerBackend.get<DiningTable>(`/dine-in/dining-table/${id}`);
  }
}
