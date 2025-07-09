import { staffBackend } from "@/backend";
import type { Location } from "@/interfaces/location";

export class LocationsService {
  static async createLocation(name: string, description: string) {
    const { data } = await staffBackend.post<Location>("/admin/locations", {
      name,
      description,
    });
    return data;
  }

  static async getLocations() {
    const { data } = await staffBackend.get<Location[]>("/admin/locations");
    return data;
  }

  static async updateLocation(id: number, name: string, description: string) {
    const { data } = await staffBackend.put<Location>(
      `/admin/locations/${id}`,
      {
        name,
        description,
      }
    );
    return data;
  }

  static async deleteLocation(id: number) {
    return staffBackend.delete(`/admin/locations/${id}`);
  }
}
