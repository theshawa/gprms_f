import { staffBackend } from "@/backend";

export interface DashboardStats {
  todayOrders: number;
  todayRevenue: number;
  totalTables: number;
}

export interface RecentOrder {
  id: number;
  orderCode: string;
  type: "dine-in" | "take-away";
  tableInfo?: string;
  customerName?: string;
  customerPhone?: string;
  time: string;
  status: string;
  totalAmount: number;
  createdAt: Date;
}

export interface RecentOrdersResponse {
  orders: RecentOrder[];
}

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface DishesResponse {
  dishes: Dish[];
  total: number;
}

export interface StaffMember {
  id: number;
  name: string;
  username: string;
  role: string;
}

export interface StaffMembersResponse {
  staffMembers: StaffMember[];
  total: number;
}

export class AdminDashboardService {
  static async getStats(): Promise<DashboardStats> {
    const response = await staffBackend.get<DashboardStats>("/admin/dashboard/stats");
    return response.data;
  }

  static async getRecentOrders(): Promise<RecentOrdersResponse> {
    const response = await staffBackend.get<RecentOrdersResponse>("/admin/dashboard/recent-orders");
    return response.data;
  }

  static async getDishes(): Promise<DishesResponse> {
    const response = await staffBackend.get<DishesResponse>("/admin/dashboard/dishes");
    return response.data;
  }

  static async getStaffMembers(): Promise<StaffMembersResponse> {
    const response = await staffBackend.get<StaffMembersResponse>("/admin/dashboard/staff");
    return response.data;
  }
}

