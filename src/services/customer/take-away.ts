import { customerBackend } from "@/backend";
import type { Dish } from "@/interfaces/dish";
import type { TakeAwayOrder } from "@/interfaces/take-away-order";

export class CustomerTakeAwayService {
  static async getProducts(query?: string) {
    // Fetch all take away dishes from the API
    const res = await customerBackend.get<Dish[]>("/takeaway/dishes", {
      params: { query },
    });
    return res.data;
  }

  static async placeOrder(
    customerName: string,
    customerPhone: string,
    notes: string,
    items: {
      dishId: number;
      quantity: number;
      priceAtOrder: number;
    }[]
  ) {
    const res = await customerBackend.post<TakeAwayOrder>(
      "/takeaway/place-order",
      {
        customerName,
        customerPhone: "+94" + customerPhone,
        notes,
        items,
      }
    );
    return res.data;
  }
}
