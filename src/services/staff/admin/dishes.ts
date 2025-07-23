import { staffBackend } from "@/backend";
import type { Dish } from "@/interfaces/dish";

export class DishesService {
  static async create(
    payload: Omit<Omit<Omit<Dish, "id">, "ingredients">, "image"> & {
      ingredients: { id: number; quantity: number }[];
      imageFile: File;
    }
  ) {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({ ...payload, imageFile: undefined })
    );

    formData.append("image", payload.imageFile);

    const { data } = await staffBackend.post<Dish>("/admin/dishes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return data;
  }

  static async getAll() {
    const { data } = await staffBackend.get<Dish[]>("/admin/dishes");
    return data;
  }

  static async update(
    id: number,
    payload: Omit<Omit<Omit<Dish, "id">, "ingredients">, "image"> & {
      ingredients: { id: number; quantity: number }[];
      imageFile?: File | null;
    }
  ) {
    const formData = new FormData();
    formData.append(
      "data",
      JSON.stringify({ ...payload, imageFile: undefined })
    );

    if (payload.imageFile) {
      formData.append("image", payload.imageFile);
    }
    const { data } = await staffBackend.put<Dish>(
      `/admin/dishes/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  }

  static async delete(id: number) {
    await staffBackend.delete(`/admin/dishes/${id}`);
  }
}
