import { staffBackend } from "@/backend";
import type { Customer } from "@/interfaces/customer";

export class CustomersService {
  static async getAll() {
    const { data } = await staffBackend.get<Customer[]>("/admin/customers");
    return data;
  }
}
