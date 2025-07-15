export interface Ingredient {
  id: number;
  name: string;
  description: string;
  costPerUnit: number;
  unit: string;
  stockQuantity: number;
  lowStockThreshold: number;
  createdAt: string;
}
