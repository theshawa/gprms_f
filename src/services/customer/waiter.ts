import { customerBackend } from "@/backend";

export interface WaiterInfo {
  id: number;
  name: string;
  status: string;
  assignedAt: string;
}

export interface WaiterAssistanceRequest {
  assistanceType: 'call_waiter' | 'request_bill' | 'complaint' | 'help' | 'order_assistance';
  notes?: string;
  priority: 'low' | 'medium' | 'high';
}

export class CustomerWaiterService {
  // Get currently assigned waiter for the table
  static async getAssignedWaiter(tableId: number) {
    const { data } = await customerBackend.get<WaiterInfo | null>(
      `/dine-in/tables/${tableId}/assigned-waiter`
    );
    return data;
  }

  // Request waiter assignment (automatic assignment)
  static async requestWaiterAssignment(tableId: number) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/request-waiter-assignment`
    );
    return data;
  }

  // Request waiter assistance
  static async requestWaiterAssistance(
    tableId: number, 
    assistanceRequest: WaiterAssistanceRequest
  ) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/request-assistance`,
      {
        ...assistanceRequest,
        timestamp: Date.now()
      }
    );
    return data;
  }

  // Get waiter assistance history for the table
  static async getAssistanceHistory(tableId: number) {
    const { data } = await customerBackend.get(
      `/dine-in/tables/${tableId}/assistance-history`
    );
    return data;
  }

  // Cancel pending assistance request
  static async cancelAssistanceRequest(tableId: number, requestId: number) {
    const { data } = await customerBackend.delete(
      `/dine-in/tables/${tableId}/assistance-requests/${requestId}`
    );
    return data;
  }

  // Rate waiter service
  static async rateWaiterService(
    tableId: number, 
    waiterId: number, 
    rating: number, 
    feedback?: string
  ) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/rate-waiter`,
      {
        waiterId,
        rating,
        feedback,
        timestamp: Date.now()
      }
    );
    return data;
  }
}
