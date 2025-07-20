import type { DishIngredient } from "./dish-ingredient";
import type { IngredientStockMovement } from "./ingredient-stock-movement";

export interface Ingredient {
  id: number;
  name: string;
  description: string;
  costPerUnit: number;
  unit: string;
  stockQuantity: number;
  lowStockThreshold: number;
  createdAt: string;
  stockMovements: IngredientStockMovement[];
  dishIngredients: DishIngredient[];
}
