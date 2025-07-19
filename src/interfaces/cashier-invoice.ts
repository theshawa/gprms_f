export interface InvoiceOrder {
  id: string;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface CashierInvoice {
  id: string;
  invoiceNumber: string;
  tableNumber?: string;
  customerName?: string;
  type: "dining" | "takeaway";
  orders: InvoiceOrder[];
  subtotal: number;
  serviceCharge: number;
  discount: number;
  loyaltyPoints: number;
  total: number;
  createdAt: string;
  status: "pending" | "paid" | "cancelled";
}
