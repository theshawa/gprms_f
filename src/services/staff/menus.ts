import { staffBackend } from "@/backend";
import type { Meal } from "@/enums/meal";
import type { Menu } from "@/interfaces/menu";

export class MenusService {
  static async getAll() {
    const { data } = await staffBackend.get<Menu[]>("/admin/menus");
    return data;
  }

  static async create(payload: {
    name: string;
    description: string;
    menuSections: {
      name: string;
      description: string;
      position: number;
      menuItems: {
        dishId: number;
        position: number;
      }[];
    }[];
  }) {
    const { data } = await staffBackend.post<Menu>("/admin/menus", payload);
    return data;
  }

  static async update(
    id: number,
    payload: {
      name: string;
      description: string;
      menuSections: {
        name: string;
        description: string;
        position: number;
        menuItems: {
          dishId: number;
          position: number;
        }[];
      }[];
    }
  ) {
    const { data } = await staffBackend.put<Menu>(
      `/admin/menus/${id}`,
      payload
    );
    return data;
  }

  static async delete(id: number) {
    await staffBackend.delete(`/admin/menus/${id}`);
  }

  static async setMenuForMeal(meal: Meal, menuId: number) {
    await staffBackend.post(`/admin/menus/set-menu-for-meal/${meal}`, {
      menuId,
    });
  }
}
