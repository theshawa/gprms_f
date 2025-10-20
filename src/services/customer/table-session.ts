import { customerBackend } from "@/backend";

export interface TableSession {
  id: number;
  tableId: number;
  customerCount: number;
  sessionStatus: 'active' | 'ordering' | 'dining' | 'bill_requested' | 'completed';
  startedAt: string;
  completedAt?: string;
  orders: any[];
  totalSpent: number;
  assignedWaiterId?: number;
}

export interface TableOccupancy {
  customerCount: number;
  specialRequests?: string;
  estimatedDuration?: number;
}

export class CustomerTableSessionService {
  // Start a new table session
  static async startSession(tableId: number, occupancy: TableOccupancy) {
    const { data } = await customerBackend.post<TableSession>(
      `/dine-in/tables/${tableId}/start-session`,
      occupancy
    );
    return data;
  }

  // Get current session details
  static async getCurrentSession(tableId: number) {
    const { data } = await customerBackend.get<TableSession>(
      `/dine-in/tables/${tableId}/session`
    );
    return data;
  }

  // Update session status
  static async updateSessionStatus(
    tableId: number, 
    status: TableSession['sessionStatus']
  ) {
    const { data } = await customerBackend.put(
      `/dine-in/tables/${tableId}/session/status`,
      { status }
    );
    return data;
  }

  // Update customer count
  static async updateCustomerCount(tableId: number, customerCount: number) {
    const { data } = await customerBackend.put(
      `/dine-in/tables/${tableId}/session/customer-count`,
      { customerCount }
    );
    return data;
  }

  // Add special requests to session
  static async addSpecialRequest(tableId: number, request: string) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/session/special-requests`,
      { request }
    );
    return data;
  }

  // Get session history
  static async getSessionHistory(tableId: number, limit: number = 10) {
    const { data } = await customerBackend.get<TableSession[]>(
      `/dine-in/tables/${tableId}/session-history`,
      {
        params: { limit }
      }
    );
    return data;
  }

  // End current session
  static async endSession(tableId: number, feedback?: string) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/end-session`,
      { 
        feedback,
        endedAt: Date.now() 
      }
    );
    return data;
  }

  // Extend session (for longer stays)
  static async extendSession(tableId: number, additionalMinutes: number) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/session/extend`,
      { additionalMinutes }
    );
    return data;
  }

  // Get table availability
  static async getTableAvailability(tableId: number) {
    const { data } = await customerBackend.get(
      `/dine-in/tables/${tableId}/availability`
    );
    return data;
  }
}
