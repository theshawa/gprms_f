import { staffBackend } from "@/backend";
import type { DiningArea } from "@/interfaces/dining-area";
import type { DiningTable } from "@/interfaces/dining-table";

export class DiningTablesService {
  static async create(payload: Partial<DiningTable>) {
    const { data } = await staffBackend.post<DiningTable>(
      "/admin/dining-tables",
      payload
    );
    return data;
  }

  static async getAll() {
    const { data } = await staffBackend.get<DiningTable[]>(
      "/admin/dining-tables"
    );
    return data;
  }

  static async getById(id: number) {
    const { data } = await staffBackend.get<DiningTable | undefined>(
      `/admin/dining-tables/${id}`
    );
    return data;
  }

  static async update(id: number, payload: Partial<DiningTable>) {
    const { data } = await staffBackend.put<DiningArea>(
      `/admin/dining-tables/${id}`,
      payload
    );
    return data;
  }

  static async delete(id: number) {
    await staffBackend.delete(`/admin/dining-tables/${id}`);
  }
}
