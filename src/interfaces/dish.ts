import type { DishIngredient } from "./dish-ingredient";

export interface Dish {
  id: number;
  name: string;
  description: string;
  price: number;
  ingredients: DishIngredient[];
}
