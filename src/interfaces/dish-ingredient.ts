import type { Dish } from "./dish";
import type { Ingredient } from "./ingredient";

export interface DishIngredient {
  id: number;
  dishId: number;
  ingredientId: number;
  quantity: number;
  dish: Dish;
  ingredient: Ingredient;
}
