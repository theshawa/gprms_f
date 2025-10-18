export interface PlaceOrderRequest {
  customerId: number;
  items: { dishId: number; quantity: number; price: number }[];
  totalAmount: number;
  notes?: string;
}
