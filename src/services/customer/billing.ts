import { customerBackend } from "@/backend";

export interface BillDetails {
  id: number;
  tableId: number;
  orders: any[];
  subtotal: number;
  tax: number;
  serviceCharge: number;
  discount: number;
  total: number;
  status: 'pending' | 'ready' | 'paid' | 'cancelled';
  createdAt: string;
  paidAt?: string;
}

export interface PaymentMethod {
  type: 'cash' | 'card' | 'digital_wallet' | 'bank_transfer';
  details?: any;
}

export class CustomerBillingService {
  // Request bill for the table
  static async requestBill(tableId: number) {
    const { data } = await customerBackend.post<BillDetails>(
      `/dine-in/tables/${tableId}/request-bill`
    );
    return data;
  }

  // Get current bill details
  static async getBillDetails(tableId: number) {
    const { data } = await customerBackend.get<BillDetails>(
      `/dine-in/tables/${tableId}/bill`
    );
    return data;
  }

  // Get bill by ID
  static async getBillById(billId: number) {
    const { data } = await customerBackend.get<BillDetails>(
      `/dine-in/bills/${billId}`
    );
    return data;
  }

  // Apply discount or coupon
  static async applyDiscount(tableId: number, discountCode: string) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/bill/apply-discount`,
      { discountCode }
    );
    return data;
  }

  // Split bill (for group payments)
  static async splitBill(tableId: number, splitCount: number) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/bill/split`,
      { splitCount }
    );
    return data;
  }

  // Process payment
  static async processPayment(
    tableId: number, 
    paymentMethod: PaymentMethod, 
    amount: number,
    tip?: number
  ) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/bill/pay`,
      {
        paymentMethod,
        amount,
        tip,
        timestamp: Date.now()
      }
    );
    return data;
  }

  // Get payment methods available
  static async getAvailablePaymentMethods(tableId: number) {
    const { data } = await customerBackend.get(
      `/dine-in/tables/${tableId}/bill/payment-methods`
    );
    return data;
  }

  // Generate bill receipt
  static async generateReceipt(tableId: number, format: 'pdf' | 'email' = 'pdf') {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/bill/receipt`,
      { format }
    );
    return data;
  }

  // Add tip to bill
  static async addTip(tableId: number, tipAmount: number) {
    const { data } = await customerBackend.post(
      `/dine-in/tables/${tableId}/bill/tip`,
      { tipAmount }
    );
    return data;
  }
}
