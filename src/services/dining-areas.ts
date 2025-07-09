import { staffBackend } from "@/backend";
import type { DiningArea } from "@/interfaces/dining-area";

export class DiningAreasService {
  static async create(name: string, description: string) {
    const { data } = await staffBackend.post<DiningArea>(
      "/admin/dining-areas",
      {
        name,
        description,
      }
    );
    return data;
  }

  static async getAll() {
    const { data } = await staffBackend.get<DiningArea[]>(
      "/admin/dining-areas"
    );
    return data;
  }

  static async update(id: number, name: string, description: string) {
    const { data } = await staffBackend.put<DiningArea>(
      `/admin/dining-areas/${id}`,
      {
        name,
        description,
      }
    );
    return data;
  }

  static async delete(id: number) {
    await staffBackend.delete(`/admin/dining-areas/${id}`);
  }
}
